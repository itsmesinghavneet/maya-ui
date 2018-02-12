import Ember from 'ember';
import C from 'ui/utils/constants';
import Subscribe from 'ui/mixins/subscribe';
import {xhrConcur} from 'ui/utils/platform';
import PromiseToCb from 'ui/mixins/promise-to-cb';
import Errors from 'ui/utils/errors';

const CHECK_AUTH_TIMER = 60 * 10 * 1000;

export default Ember.Route.extend(Subscribe, PromiseToCb, {

    prefs: Ember.inject.service(),
    session: Ember.inject.service(),
    mayaorgfancyname: Ember.inject.service(),
    organization: Ember.inject.service(),
    projects: Ember.inject.service(),
    settings: Ember.inject.service(),
    access: Ember.inject.service(),
    userTheme: Ember.inject.service('user-theme'),
    language: Ember.inject.service('user-language'),
    storeReset: Ember.inject.service(),
    modalService: Ember.inject.service('modal'),

    testTimer: null,

    beforeModel(transition) {
        this._super.apply(this, arguments);
        if (this.get('access.enabled')) {
            if (this.get('session').get(C.SESSION.ACCOUNT_ID)) {
                if (this.get('access.isLoggedIn')) {
                    this.testAuthToken();
                } else {
                    transition.send('logout', transition, false);
                    return Ember.RSVP.reject('Not logged in');
                }
            } else {
                this.transitionTo('mayalogin');
            }
        }
    },
    testAuthToken: function () {
        let timer = Ember.run.later(() => {
            this.get('access').testAuth().then(( /* res */ ) => {
                this.testAuthToken();
            }, ( /* err */ ) => {
                this.send('logout', null, true);
            });
        }, CHECK_AUTH_TIMER);

        this.set('testTimer', timer);
    },

    model(params, transition) {
        if (this.get('session').get(C.SESSION.ACCOUNT_ID)) {
            let accountArr = this.get('session').get(C.SESSION.ACCOUNT_ID).split('a'); //Account Id is 1a9 but we need only numeric value.
            let accountId = accountArr[1];
            this.get('userStore').find('accounts', null, {
                url: 'accounts',
                filter: {
                    id: accountId
                },
                forceReload: true
            }).then((res) => {
                if (res) {
                    var interesting = {};
                    interesting[C.SESSION.ACCESS_PERMISSION] = res.content[0].accessGrant;
                    this.get('session').setProperties(interesting);
                    if (this.get('session').get(C.SESSION.ACCESS_PERMISSION) === C.USER.ACCESS_PERMISSION_DENIED) {
                        this.transitionTo('welcome');
                    
                    }
                }
            });
        }

        let type = this.get(`session.${C.SESSION.USER_TYPE}`);
        let isAdmin = (type === C.USER.TYPE_ADMIN) || !this.get('access.enabled');
        this.set('access.admin', isAdmin);

        this.get('session').set(C.SESSION.BACK_TO, undefined);


        let promise = new Ember.RSVP.Promise((resolve, reject) => {
            let tasks = {
                userSchemas: this.toCb('loadUserSchemas'),
                clusters: this.toCb('loadClusters'),
                organizations: this.toCb('loadOrg'),
                slackintegrations: this.toCb('loadSlack'),
                slackclusterassociations: this.toCb('loadSlackCluster'),
                projects: this.toCb('loadProjects'),
                preferences: this.toCb('loadPreferences'),
                settings: this.toCb('loadPublicSettings'),
                project: ['clusters', 'projects', 'preferences', 'organizations',
                    this.toCb('selectProject', transition)],
                projectSchemas: ['project', this.toCb('loadProjectSchemas')],
                mayaapplications: ['projectSchemas', this.cbFind('mayaapplication')], //real data
                services: ['projectSchemas', this.cbFind('service')],
                hosts: ['projectSchemas', this.cbFind('host')],
                identities: ['userSchemas', this.cbFind('identity', 'userStore')],
            };
            async.auto(tasks, xhrConcur, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        }, 'Load all the things');

        return promise.then((hash) => {
            return Ember.Object.create(hash);
        }).catch((err) => {
            return this.loadingError(err, transition, Ember.Object.create({
                projects: [],
                project: null,
            }));
        });
    },

    activate() {
        let app = this.controllerFor('application');

        this._super();
        if (!this.controllerFor('application').get('isPopup') && this.get('projects.current')) {
            this.connectSubscribe();
        }

        if (this.get('settings.isRancher') && !app.get('isPopup')) {
            let form = this.get(`settings.${C.SETTING.FEEDBACK_FORM}`);

            //Show the telemetry opt-in
            let opt = this.get(`settings.${C.SETTING.TELEMETRY}`);
            if (this.get('access.admin') && (!opt || opt === 'prompt')) {
                Ember.run.scheduleOnce('afterRender', this, function () {
                    // this.get('modalService').toggleModal('modal-telemetry');
                });
            } else if (form && !this.get(`prefs.${C.PREFS.FEEDBACK}`)) {
                Ember.run.scheduleOnce('afterRender', this, function () {
                    // this.get('modalService').toggleModal('modal-feedback');
                });
            }
        }
    },

    deactivate() {
        this._super();
        this.disconnectSubscribe();
        Ember.run.cancel(this.get('testTimer'));

        // Forget all the things
        this.get('storeReset').reset();
    },

    loadingError(err, transition, ret) {
        let isAuthEnabled = this.get('access.enabled');
        let isAuthFail = [401, 403].indexOf(err.status) >= 0;

        var msg = Errors.stringify(err);
        console.log('Loading Error:', msg, err);
        if (err && (isAuthEnabled || isAuthFail)) {
            this.send('logout', transition, isAuthFail, (isAuthFail ? undefined : msg));
            return;
        }
        this.replaceWith('mayasecure.clusters');
        return ret;
    },

    cbFind(type, store = 'store', opt = null) {
        return (results, cb) => {
            if (typeof results === 'function') {
                cb = results;
                results = null;
            }

            return this.get(store).find(type, null, opt).then(function (res) {
                cb(null, res);
            }).catch(function (err) {
                cb(err, null);
            });
        };
    },
    loadPreferences() {
        return this.get('userStore').find('userpreferences', null, {
            url: 'userpreferences',
            forceReload: true
        }).then((res) => {
            // Save the account ID from the response headers into session
            if (res) {
                this.set(`session.${C.SESSION.ACCOUNT_ID}`, res.xhr.headers.get(C.HEADER.ACCOUNT_ID));
            }

            this.get('language').initLanguage(true);
            this.get('userTheme').setupTheme();

            if (this.get(`prefs.${C.PREFS.I_HATE_SPINNERS}`)) {
                Ember.$('BODY').addClass('i-hate-spinners');
            }

            return res;
        });
    },

    loadProjectSchemas() {
        var store = this.get('store');
        store.resetType('schema');
        return store.rawRequest({
            url: 'schema',
            dataType: 'json'
        }).then((xhr) => {
            store._bulkAdd('schema', xhr.body.data);
        });
    },

    loadUserSchemas() {
        // @TODO Inline me into releases
        let userStore = this.get('userStore');
        return userStore.rawRequest({
            url: 'schema',
            dataType: 'json'
        }).then((xhr) => {
            userStore._bulkAdd('schema', xhr.body.data);
        });
    },

    loadClusters() {
        return this.get('userStore').find('cluster', null, {
            url: 'clusters'
        });
    },
    loadSlack() {
        return this.get('userStore').find('slackintegration', null, {
            url: 'slackintegrations'
        });
    },
    loadSlackCluster() {
        return this.get('userStore').find('slackclusterassociation', null, {
            url: 'slackclusterassociations'
        });
    },
    //Maya
    loadOrg() {
        return this.get('userStore').find('organization', null, {
            url: 'organizations'
        });
    },
    loadProjects() {
        let svc = this.get('projects');
        return svc.getAll().then((all) => {
            svc.set('all', all);
            return all;
        });
    },

    updateOrchestration() {
        return this.get('projects').updateOrchestrationState();
    },

    loadPublicSettings() {
        return this.get('userStore').find('setting', null, {
            url: 'settings',
            forceReload: true,
            filter: {
                all: 'false'
            }
        });
    },

    selectProject(transition) {
        let projectId = null;
        /*Rancher's*/
        if (transition.params && transition.params['mayasecure.project'] && transition.params['mayasecure.project'].project_id) {
            projectId = transition.params['mayasecure.project'].project_id;
        }
        /*Rancher's End */
        /*
        if ( transition.params && transition.params['mayasecure.clusters'] && transition.params['mayasecure.clusters'].project_id )
        {
          projectId = transition.params['mayasecure.clusters'].project_id;
        }
        */
        // Make sure a valid project is selected
        return this.get('projects').selectDefault(projectId);
    },

    _gotoRoute(name, withProjectId = true) {
        // Don't go to routes if in a form page, because you can easily not be on an input
        // and leave the page accidentally.
        if ($('FORM').length === 0) {
            if (withProjectId) {
                this.transitionTo(name, this.get('projects.current.id'));
            } else {
                this.transitionTo(name);
            }
        }
    },

    actions: {

        error(err, transition) {
            // Unauthorized error, send back to login screen
            if (err.status === 401) {
                this.send('logout', transition, true);
                return false;
            } else {
                // Bubble up
                return true;
            }
        },

        showAbout() {
            this.controllerFor('application').set('showAbout', true);
        },

        switchProject(projectId, transitionTo = 'mayasecure', transitionArgs) {
            console.log('Switch to ' + projectId);
            this.disconnectSubscribe(() => {
                console.log('Switch is disconnected');
                this.send('finishSwitchProject', projectId, transitionTo, transitionArgs);
            });
        },

        finishSwitchProject(projectId, transitionTo, transitionArgs) {
            console.log('Switch finishing');
            this.get('storeReset').reset();
            if (transitionTo) {
                let args = (transitionArgs || []).slice();
                args.unshift(transitionTo);
                this.transitionTo.apply(this, args);
            }
            this.set(`tab-session.${C.TABSESSION.PROJECT}`, projectId);
            this.refresh();
            console.log('Switch finished');
        },
    },
});