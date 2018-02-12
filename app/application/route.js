import Ember from 'ember';
import C from 'ui/utils/constants';
export default Ember.Route.extend({
    organization: Ember.inject.service(),
    access: Ember.inject.service(),
    cookies: Ember.inject.service(),
    github: Ember.inject.service(),
    google: Ember.inject.service(),
    slack: Ember.inject.service(),
    language: Ember.inject.service('user-language'),
    modal: Ember.inject.service(),
    prefs: Ember.inject.service(),
    settings: Ember.inject.service(),

    previousParams: null,
    previousRoute: null,
    loadingShown: false,
    loadingId: 0,
    hideTimer: null,
    previousLang: null,

    title: function (tokens) {
        tokens = Ember.makeArray(tokens);
        tokens.unshift('MayaOnline');
        return tokens.join(' - ');
    },

    actions: {
        loading(transition) {
            this.incrementProperty('loadingId');
            let id = this.get('loadingId');
            Ember.run.cancel(this.get('hideTimer'));

            //console.log('Loading', id);
            if (!this.get('loadingShown')) {
                this.set('loadingShown', true);
                //console.log('Loading Show', id);

                $('#loading-underlay').stop().show().fadeIn({
                    duration: 100,
                    queue: false,
                    easing: 'linear',
                    complete: function () {
                        $('#loading-overlay').stop().show().fadeIn({
                            duration: 200,
                            queue: false,
                            easing: 'linear'
                        });
                    }
                });
            }

            transition.finally(() => {
                var self = this;

                function hide() {
                    //console.log('Loading hide', id);
                    self.set('loadingShown', false);
                    $('#loading-overlay').stop().fadeOut({
                        duration: 200,
                        queue: false,
                        easing: 'linear',
                        complete: function () {
                            $('#loading-underlay').stop().fadeOut({
                                duration: 100,
                                queue: false,
                                easing: 'linear'
                            });
                        }
                    });
                }

                if (this.get('loadingId') === id) {
                    if (transition.isAborted) {
                        //console.log('Loading aborted', id, this.get('loadingId'));
                        this.set('hideTimer', Ember.run.next(hide));
                    } else {
                        //console.log('Loading finished', id, this.get('loadingId'));
                        //needed to set this to run after render as there was wierdness wiht new register page
                        Ember.run.scheduleOnce('afterRender', () => {
                            hide();
                        });
                    }
                }
            });

            return true;
        },

        error(err, transition) {
            /*if we dont abort the transition we'll call the model calls again and fail transition correctly*/
            transition.abort();

            if (err && err.status && [401, 403].indexOf(err.status) >= 0) {
                this.send('logout', transition, true);
            }

            this.controllerFor('application').set('error', err);
            this.transitionTo('failWhale');

            //console.log("Application Error", (err ? err.stack : undefined));
        },

        goToPrevious(def) {
            this.goToPrevious(def);
        },

        finishLogin() {
            this.finishLogin();
        },

        logout(transition, timedOut, errorMsg) {
            let session = this.get('session');
            let access = this.get('access');
            access.clearToken().finally(() => {
                session.set(C.SESSION.ACCOUNT_ID, null);
                this.get('tab-session').clear();
                this.set(`session.${C.SESSION.CONTAINER_ROUTE}`, undefined);
                access.clearSessionKeys();
                if (transition && !session.get(C.SESSION.BACK_TO)) {
                    session.set(C.SESSION.BACK_TO, window.location.href);
                }
                if (this.get('modal.modalVisible')) {
                    this.get('modal').toggleModal();
                }
                let params = {
                    queryParams: {}
                };
                if (timedOut) {
                    params.queryParams.timedOut = true;
                }
                if (errorMsg) {
                    params.queryParams.errorMsg = errorMsg;
                }
                this.transitionTo('mayalogin', params);
            });
        },

        langToggle() {
            let svc = this.get('language');
            let cur = svc.getLocale();
            if (cur === 'none') {
                svc.sideLoadLanguage(this.get('previousLang') || 'en-us');
            } else {
                this.set('previousLang', cur);
                svc.sideLoadLanguage('none');
            }
        },

        systemToggle() {
            this.get('prefs').toggleProperty('showSystemResources');
        }
    },

    shortcuts: {
        'shift+l': 'langToggle',
        's': 'systemToggle',
    },

    finishLogin() {
        let session = this.get('session');
        let backTo = session.get(C.SESSION.BACK_TO);
        session.set(C.SESSION.BACK_TO, undefined);
        if (backTo) {
            //console.log("Going back to", backTo);
            window.location.href = backTo;
        } else {
            this.replaceWith('mayasecure');
        }
    },

    model(params, transition) {
        let github = this.get('github');
        let google = this.get('google');
        let slack = this.get('slack');
        let stateMsg = 'Authorization state did not match, please try again.';

        this.get('language').initLanguage();

        transition.finally(() => {
            this.controllerFor('application').setProperties({
                state: null,
                code: null,
                error_description: null,
                redirectTo: null,
            });
        });

        if (params.redirectTo) {
            let path = params.redirectTo;
            if (path.substr(0, 1) === '/') {
                this.get('session').set(C.SESSION.BACK_TO, path);
            }
        }

        if (params.isPopup) {
            this.controllerFor('application').set('isPopup', true);
        }

        if (params.isTest) {
            if (github.stateMatches(params.state)) {
                reply(params.error_description, params.code);
            } else {
                reply(stateMsg);
            }

            transition.abort();

            return Ember.RSVP.reject('isTest');

        } else if (params.code) {

            // Code for google auth
            if (this.get('session').get('authProvider') === 'googleconfig') {

                if (google.stateMatches(params.state)) {
                    return this.get('access').login(params.code).then(() => {
                        transition.abort();
                        this.finishLogin();
                    }).catch((err) => {
                        transition.abort();
                        this.transitionTo('mayalogin', {
                            queryParams: {
                                errorMsg: err.message
                            }
                        });
                    }).finally(() => {
                        this.controllerFor('application').setProperties({
                            state: null,
                            code: null,
                        });
                    });
                } else {
                    let obj = {
                        message: stateMsg,
                        code: 'StateMismatch'
                    };
                    this.controllerFor('application').set('error', obj);
                    return Ember.RSVP.reject(obj);
                }
            }

            // Code for github auth
            else if (this.get('session').get('authProvider') === 'githubconfig') {
                if (github.stateMatches(params.state)) {
                    return this.get('access').login(params.code).then(() => {
                        transition.abort();
                        this.finishLogin();
                    }).catch((err) => {
                        transition.abort();
                        this.transitionTo('mayalogin', {
                            queryParams: {
                                errorMsg: err.message
                            }
                        });
                    }).finally(() => {
                        this.controllerFor('application').setProperties({
                            state: null,
                            code: null,
                        });
                    });
                } else {
                    let obj = {
                        message: stateMsg,
                        code: 'StateMismatch'
                    };
                    this.controllerFor('application').set('error', obj);
                    return Ember.RSVP.reject(obj);
                }
            }
            // Code for slack auth
            else if (this.get('session').get('authProvider') === 'slackconfig') {
                if (self.window.name) {
                    window.close();
                    window.opener.location.href = window.opener.location.href + location.search;
                } else {
                    if (slack.stateMatches(params.state)) {
                        return this.get('slack').login(params.code).then((res) => {
                            if(this.get('session').get('slackOauthRedirect')){
                                location.replace('organization/mulebot/'+res.body.id);
                            }else{
                                let tabSession = this.get('tab-session');
                                tabSession.set('automateSlackId',res.body.id);
                                if(this.get('session').get('isDefaultSlackCard')){
                                    this.get('session').set('isDefaultSlackCard',false);
                                    location.replace('mulebot/'+res.body.id);
                                }
                            }
                        }).catch(( /*err*/ ) => {
                            this.replaceWith('mayasecure');
                        }).finally(() => {
                            this.controllerFor('application').setProperties({
                                state: null,
                                code: null,
                            });
                        });
                    } else {
                        let obj = {
                            message: stateMsg,
                            code: 'StateMismatch'
                        };
                        this.controllerFor('application').set('error', obj);
                        return Ember.RSVP.reject(obj);
                    }
                }
            }


            // End of params.code check.
        }

        function reply(err, code) {
            try {
                window.opener.window.onGithubTest(err, code);
                setTimeout(function () {
                    window.close();
                }, 250);
                return new Ember.RSVP.promise();
            } catch (e) {
                window.close();
            }
        }
    },

    beforeModel() {
        let agent = window.navigator.userAgent.toLowerCase();

        if (agent.indexOf('msie ') >= 0 || agent.indexOf('trident/') >= 0) {
            this.replaceWith('ie');
            return;
        }

        // Find out if auth is enabled
        return this.get('access').detect();
    },
});