import Ember from 'ember';
export default Ember.Component.extend({
    github: Ember.inject.service(),
    session: Ember.inject.service(),
    actions: {
        authenticate() {
            var provider = 'githubconfig';
            this.get('session').set('authProvider',provider);
            this.sendAction('action');
            Ember.run.later(() => {
                this.get('github').authorizeRedirect();
            }, 10);

        }
    }
});

 