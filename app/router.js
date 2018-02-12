import Ember from 'ember';
import config from './config/environment';
import {applyRoutes, clearRoutes} from 'ui/utils/additional-routes';

const Router = Ember.Router.extend({
    modalService: Ember.inject.service('modal'),
    location: config.locationType,
    headData: Ember.inject.service(),

    setTitle(title) {
        this.get('headData').set('title', title);
    },

    willTransition(){
        if (this.get('modalService.modalVisible')) {
            this.get('modalService').toggleModal();
        }
    },
});

Router.map(function() {
    this.route('ie');
    this.route('index');
    this.route('failWhale', {path: '/fail'});
    this.route('not-found', {path: '*path'});
    this.route('logout');
    this.route('mayasecure',{path: '/'}, function() {
        this.route('clusters', function() {
            this.route('index', {path: '/'});
            this.route('new-project', {path: '/add-env'});
            this.route('cluster', {path: '/:cluster_id'}, function() {
                this.route('edit');
                this.route('import');
                this.route('hosts');
                this.route('host-new', {path: '/add-host'});
                this.route('host-templates', {path: '/launch-host'}, function() {
                    this.route('index', {path: '/'});
                    this.route('launch', {path: '/:template_id'});
                });
            });
        });
        this.route('project', {path: '/cluster/:project_id'}, function() {
            this.route('index', {path: '/'});
            this.route('apikeys', {path: '/api/keys'}, function() {
                this.route('account', {path: '/account'});
                this.route('environment', {path: '/environment'});
            });
            this.route('hosts', {path: '/hosts', resetNamespace: true}, function() {
                this.route('index', {path: '/'});
            });
            this.route('mayaapplications',{path: '/applications',resetNamespace: true}, function() {
                this.route('mayaapplication', {path: '/:mayaapplication_id', resetNamespace: true});
            });
            this.route('mayavolumes',{path: '/volumes',resetNamespace: true}, function() {
                this.route('mayavolume');
            });
        });

        this.route('adminpanel', function() {
            this.route('user');
            this.route('organization');
            this.route('settings');
        });
        this.route('settings', function() {
            this.route('profile');
        });
        this.route('organizations',{path: '/organization'},function() {
            this.route('slackconfigure',{path: '/mulebot/:slackintegration_id'});
        });
        this.route('dashboard');
        this.route('defaultmulebot',{path:'/mulebot/:slackintegration_id'});
        this.route('slack');
    });
    this.route('verifyemail');
    this.route('welcome',function() {
        this.route('thanks');
    });

    this.route('mayalogin', {path: '/login'}, function() {
    });

    // Load any custom routes from additional-routes
    var cb = applyRoutes('application');
    if( cb ) {
        cb.apply(this);
    }
    clearRoutes();
}); 


export default Router;
