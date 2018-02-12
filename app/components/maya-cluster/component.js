import Ember from 'ember';

export default Ember.Component.extend({
    classNames:['d-flex'],
    resourceActions : Ember.inject.service('resource-actions'),
    userStore: Ember.inject.service(),
    session : Ember.inject.service(),
    growl: Ember.inject.service(),
    countApps : null,
    slackcards : null,
    currentOrganizationState : null,
    init(){
        this._super(...arguments);

        // Code for slack connections for each cluster
        // Start
        this.set('currentOrganizationState',this.get('session').get('currentOrgState'));
        let currentClusterId = this.get('model').id;
        let slackintegrations = this.get('slackintegration').content;
        let slackclusterassociations = this.get('slackclusterassociation').content;
        let slackcard = [];
        slackclusterassociations.forEach(function(item){
            if(item.clusterId===currentClusterId){
                slackcard.push(item.slackIntegrationId);
            }
        });
        let uniqueSlackCard = [];
        slackcard.forEach(function(item){
            if(uniqueSlackCard.indexOf(item)<0){
                uniqueSlackCard.push(item);
            }
        });
        let uniqueslackintegrations = [];
        slackintegrations.forEach(function(item){
            if(uniqueSlackCard.indexOf(item.id)>=0){
                uniqueslackintegrations.push(item);
            }
        });
        this.set('slackcards',uniqueslackintegrations);
        //use {{slackcards}} to display all slack cluster related to a cluster.
        // End

        if(this.get('model.state')==='active'){
            let defproId = this.get('model.defaultProject.id');
            this.get('userStore').rawRequest({url:'projects/'+defproId+'/mayaapplications'}).then((xhr) => {
                this.set('countApps',xhr.body.data.length);
            });
        }
    },
    actions:{
        editCluster(val){
            this.get('resourceActions').triggerActionMaya(val,'edit');
        },
        deleteCluster(val){
            this.get('resourceActions').triggerActionMaya(val,'promptDelete');
        },
        switchToProject(id) {
            this.sendAction('switchProject', id);
        },
        notify(){
            let state = this.get('userStore').find('organization',this.get('session').get('currentOrgId'));
            state = state._result.state;
            if(state === 'creating'){
                this.get('growl').message('<h6>Sit back and relax.<br/> We are settings up things for you.</h6>');
                return;
            }else if(state === 'active'){
                this.get('growl').message('<h6>Sit back and relax.<br/> We are settings up things for you.</h6>');
                this.get('session').set('currentOrgState',state);
                this.set('currentOrganizationState',this.get('session').get('currentOrgState'));
            }
        }
    }
});
