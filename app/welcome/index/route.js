import Ember from 'ember';
import C from 'ui/utils/constants';
export default Ember.Route.extend({
    session: Ember.inject.service(),
    beforeModel(/*transition*/) {
        this._super.apply(this,arguments);
        if(this.get('session').get(C.SESSION.ACCOUNT_ID)){
            if(this.get('session').get(C.SESSION.ACCESS_PERMISSION)===C.USER.ACCESS_PERMISSION_ALLOWED){
                this.transitionTo('mayasecure');
            }
        }
        else{
            this.transitionTo('mayasecure');
        }
    },
    model(){
        let accountArr=this.get('session').get(C.SESSION.ACCOUNT_ID).split('a');//Account Id is 1a9 but we need only numeric value.
        let accountId=accountArr[1];
        return this.get('userStore').find('accounts', null, {url: 'accounts', filter: {id:accountId}, forceReload: true});
    }
});
