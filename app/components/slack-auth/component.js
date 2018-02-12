import Ember from 'ember';

export default Ember.Component.extend({
    slack: Ember.inject.service(),
    session: Ember.inject.service(),
    actions: {
        authenticate() {
            this.get('session').set('redirectUrl', window.location.href);
            this.get('session').set('slackOauthRedirect',true);
            var provider = 'slackconfig';
            this.get('session').set('authProvider', provider);
            Ember.run.later(() => {
                this.get('slack').authorizeRedirect();
            }, 10);

        }
    }
});