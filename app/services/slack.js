import Ember from 'ember';
import C from 'ui/utils/constants';
import Util from 'ui/utils/util';

export default Ember.Service.extend({
    access: Ember.inject.service(),
    cookies  : Ember.inject.service(),
    session  : Ember.inject.service(),
    userStore: Ember.inject.service(),
    mayaslackfancyname : Ember.inject.service(),
 
    generateState: function() {
        var state = Math.random()+'';
        this.get('session').set('slackState', state);
        return state;
    },

    stateMatches: function(actual) {
        var expected = this.get('session.slackState');
        return actual && expected === actual;
    },

    getAuthorizeUrl: function(test) {
        var redirect = this.get('session').get(C.SESSION.BACK_TO) || window.location.href;

        if ( test )
        {
            redirect = Util.addQueryParam(redirect, 'isTest', 1);
        }
        var slackUrl = this.get('access.token.slackOauthUrl');
        var url = Util.addQueryParams(slackUrl, {
            state: this.generateState(),
            redirect_uri: redirect
        });
        return url;
    },

    authorizeRedirect: function() {
        var h = 400;
        var w = 600;
        var l = (screen.width/2)-(600/2);
        var t = (screen.height/2)-(400/2);
        window.open(this.getAuthorizeUrl(),'auth_popup','width='+w+',height='+h+',scrollbars=no,resizable=no,top='+t+',left='+l+'');
    },

    login(code) {
        let slackCardName;
        let kind;
        if(this.get('session').get('isDefaultSlackCard')){
            slackCardName = C.DEFAULT_SLACK_CARD_NAME;
            kind = 'default';
        }else{
            slackCardName = this.get('mayaslackfancyname').slackFancyName;
            kind = 'regular';
        }
        return this.get('userStore').rawRequest({
            url: 'slackintegrations',
            method: 'POST',
            data: {
                kind: kind,
                code: code,
                organizationId : this.get('session').get('currentOrgId'),
                name : slackCardName,
                redirectUrl : this.get('session').get('redirectUrl'),
            },
        }).then((xhr) => {
            return xhr;
        }).catch((res) => {
            let err;
            try {
                err = res.body;
            } catch(e) {
                err = {type: 'error', message: 'Error logging in'};
            }
            return Ember.RSVP.reject(err);
        });
    },
});