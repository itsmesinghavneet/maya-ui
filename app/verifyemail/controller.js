import Ember from 'ember';
import C from 'ui/utils/constants';
export default Ember.Controller.extend({
    session: Ember.inject.service(),
    queryParams: ['emailtoken'],
    verificationString: null, 
    init(){
        this._super(...arguments);
        if(!this.get('session').get(C.SESSION.ACCOUNT_ID)){
            this.transitionToRoute('mayasecure');
        }
        else{
            Ember.run.later(() => this.verify(),0);
        }
    },
    verify(){
        let str=this.get('emailtoken');
        let currentUserId=this.get('session').get(C.SESSION.ACCOUNT_ID);
        this.get('userStore').rawRequest({
            url: 'accounts/'+currentUserId+'?'+'emailtoken='+str,
            method: 'PUT',
        }).then((/*xhr*/) => {
	
        }).catch((/*res*/) => {
            //let err;
            try {
                //err = res.body;
            } catch(e) {
                //err = {type: "error", message: "Some Exception Occured "};
            }
            //console.log(err);
        });
    },

}); 
