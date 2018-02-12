import Ember from 'ember';
export default Ember.Route.extend({
    session: Ember.inject.service(),
    model(){
        return this.get('userStore').find('accounts', null, {url: 'accounts?externalIdType_notnull',forceReload: true});
    }
});