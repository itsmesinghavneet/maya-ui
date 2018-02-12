import Ember from 'ember';
import C from 'ui/utils/constants';
export default Ember.Route.extend({
    access: Ember.inject.service(),
    session: Ember.inject.service(),
    language: Ember.inject.service('user-language'),
    beforeModel(/*transition*/) {
        this._super.apply(this,arguments);
        if(this.get('session').get(C.SESSION.ACCOUNT_ID)){
            this.transitionTo('mayasecure');
        }
        return this.get('language').initUnauthed().then(() => {
            if ( !this.get('access.enabled'))
            {
       
                this.transitionTo('mayasecure');
            }
        });
    },
});
