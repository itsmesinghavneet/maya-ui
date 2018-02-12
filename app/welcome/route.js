import C from 'ui/utils/constants';
import Ember from 'ember';
export default Ember.Route.extend({ 
    beforeModel(){
        if(!this.get('session').get(C.SESSION.ACCOUNT_ID)){
            this.transitionTo('mayasecure');
        }
    },
    model() {
        if(this.get('session').get(C.SESSION.ACCOUNT_ID)){
            let accountArr=this.get('session').get(C.SESSION.ACCOUNT_ID).split('a');//Account Id is 1a9 but we need only numeric value.
            let accountId=accountArr[1];
            this.get('userStore').find('accounts', null, {url: 'accounts',filter: {id:accountId},forceReload: true}).then((res) => {
                if ( res ){
                    if(res.content[0].accessGrant===C.USER.ACCESS_PERMISSION_ALLOWED){
                        this.transitionTo('mayasecure');
                    }
                }
            });
	
        }
        else{
            this.transitionTo('mayalogin');
        }
    } 
});    
 