import Ember from 'ember';
import C from 'ui/utils/constants';
import Util from 'ui/utils/util';

export default Ember.Service.extend({
    access: Ember.inject.service(),
    cookies  : Ember.inject.service(),
    session  : Ember.inject.service(),
    userStore: Ember.inject.service(),

    // Set by app/services/access
    hostname : null,
    scheme   : null,
    clientId : null,
 
    generateState: function() {
        var state = Math.random()+'';
        this.get('session').set('googleState', state);
        return state;
    },

    getToken: function() {
        return new Ember.RSVP.Promise((resolve, reject) => {
            this.get('userStore').rawRequest({
                url: 'token',
            })
                .then((xhr) => {
                    resolve(xhr.body.data[0]);
                    return ;
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    stateMatches: function(actual) {
        var expected = this.get('session.googleState');
        return actual && expected === actual;
    },

    getAuthorizeUrl: function(test) {
        var redirect = this.get('session').get(C.SESSION.BACK_TO) || window.location.href;

        if ( test )
        {
            redirect = Util.addQueryParam(redirect, 'isTest', 1);
        }
        // Todo Change redirectUrl this.get('access.token.redirectUrl'
        //var test = "https://accounts.google.com/o/oauth2/v2/auth?client_id=705449940484-vj4u28hgg68ud29qf3eats47qcnsbn3t.apps.googleusercontent.com&response_type=code&scope=email&redirect_uri=https://localhost:8000";
        // this.get('access.token.redirectUrl')
        var url = Util.addQueryParams(test, {
            state: this.generateState(),
            redirect_uri: redirect
        });
        return url;
    },

    authorizeRedirect: function() {
        window.location.href = this.getAuthorizeUrl();
    // TODO refactor code
    //window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=705449940484-vj4u28hgg68ud29qf3eats47qcnsbn3t.apps.googleusercontent.com&response_type=code&scope=email&redirect_uri=https://localhost:8000";
    },

    authorizeTest: function(cb) {
        var responded = false;
        window.onGithubTest = function(err,code) {
            if ( !responded ) {
                responded = true;
                cb(err,code);
            }
        };

        var popup = window.open(this.getAuthorizeUrl(true), 'rancherAuth', Util.popupWindowOptions());
        var timer = setInterval(function() {
            if ( !popup || popup.closed ) {
                clearInterval(timer);
                if( !responded ) {
                    responded = true;
                    cb({type: 'error', message: 'Google access was not authorized'});
                }
            }
        }, 500);
    },
});
 
