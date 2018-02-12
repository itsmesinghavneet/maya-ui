import Ember from 'ember';

export default Ember.Component.extend({
    resourceActions : Ember.inject.service('resource-actions'),
    modalService: Ember.inject.service('modal'),
    userStore: Ember.inject.service(),
    currentModel : null,
    currentModelId : null,
    slackCluster : null,
    countVaule : 0,
    updatevalue : true,
    isPrivate : false,
    refreshTimer: null,
    init(){
        this._super(...arguments);
        this.set('currentModelId',this.get('model').id);
        this.set('currentModel',this.get('model'));
        let channelId = this.get('model').channelId;
        if(channelId){
            if(channelId[0]==='G'){
                this.set('isPrivate',true);
            }
        }
        let slackCluster1 = [];
        let test = this.get('model.associatedClusters');
        for(var key in test) {
            var value = test[key];
            var test1 = {name:value};
            slackCluster1.push(test1);
        }
        this.set('slackCluster',slackCluster1);
        this.scheduleRefresh();
    },
    willDestroyElement() {
        this._super(...arguments);
        this.cancelRefresh();
    },
    actions:{
        deleteslackCard(){
            this.set('updatevalue',false);
            let resource = [];
            resource.push(this.get('currentModel'));
            this.get('modalService').toggleModal('confirm-delete',{resources:resource});
        },
        editslackCard(){
            this.set('updatevalue',false);
            this.get('router').transitionTo('mayasecure.organizations.slackconfigure',this.get('currentModelId'));
        }
    },
    scheduleRefresh() {
        this.set('refreshTimer', Ember.run.later(this, 'refreshSlack',500));
    },
    cancelRefresh() {
        Ember.run.cancel(this.get('refreshTimer'));
    },
    refreshSlack() {
        let data;
        this.get('userStore').rawRequest({url:'slackintegrations/'+this.get('currentModelId')}).then((xhr) => {
            data = xhr.body.associatedClusters;
            let slackCluster1 = [];
            for(var key in data) {
                var value = data[key];
                var tmp = {name:value};
                slackCluster1.push(tmp);
            }
            this.set('slackCluster',slackCluster1);
            this.set('countVaule',this.get('countVaule')+1);
        });
        if(this.get('countVaule')<5){
            this.scheduleRefresh();
        }
    },
});
