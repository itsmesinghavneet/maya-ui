import Ember from 'ember';

export default Ember.Route.extend({
    projects: Ember.inject.service(),
    redirect() {
        this.replaceWith('mayasecure.dashboard');
    },
});
 
