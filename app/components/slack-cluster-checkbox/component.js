import Ember from 'ember';

export default Ember.Component.extend({
    printlock:null,
    init(){
        this._super(...arguments);
        if(this.get('model.resource.type')==='slackIntegration'){
            if(this.get('model.resource.token.incomingWebhook.channel')){
                let channelname = this.get('model.resource.token.incomingWebhook.channel');
                if(!(channelname[0]=== '#'||channelname[0]=== '@')){
                    this.set('printlock',true);
                }
            }
        }
    },
    actions:{
        updateClustersWithOptions(param){
            this.sendAction('updateClustersWithOptions',param);
        }
    }
});
