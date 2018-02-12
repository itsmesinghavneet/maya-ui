import Ember from 'ember';

export default Ember.Component.extend({
    google: Ember.inject.service(),
    session: Ember.inject.service(),
    actions: {
        authenticate() {
            var provider = 'googleconfig';
            this.get('session').set('authProvider', provider);
            this.sendAction('action');
            Ember.run.later(() => {
                this.get('google').authorizeRedirect();
            }, 10);

        }
    }
});