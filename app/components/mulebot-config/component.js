import Ember from 'ember';

export default Ember.Component.extend({
    updatesetting: Ember.inject.service(),
    slack: Ember.inject.service(),
    slackConfig : Ember.computed.alias('model.slackConfig'),
    actions:{
        update(){
            this.get(this, 'growl').message('Error, input error');
            let mulebotcid = this.get('mulebotcid');
            let mulebotcrt = this.get('mulebotcrt');
            let mulebotrurl = this.get('mulebotrurl');
            if (mulebotcid===undefined || mulebotcid === ''||mulebotcrt===undefined || mulebotcrt === ''||mulebotrurl===undefined || mulebotrurl === '') {
            }
            else{          this.get('updatesetting').updatesettingformulebot(mulebotcid,mulebotcrt,mulebotrurl);
            }
        },
    },
});
