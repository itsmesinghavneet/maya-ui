import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service(),
    slackclusterassociation: Ember.inject.service(),
    dropdownvalue : null,
    finalSelectedClusters : null,
    showCluster : false,
    updatevalue : true,
    slackIntegrationId : null,
    clustersWithOptions : null,
    initialSelectedClusters : null,
    initialSlackClusterAssociation : null,
    init() {
        this._super(...arguments);
        let slackintegrationId = this.get('model');
        this.set('slackIntegrationId',slackintegrationId);
        this.initize();
    },
    initize(){
        let slackIntegrationId = this.get('slackIntegrationId');
        let allslackclusterassociation;
        let allcluster = this.get('userStore').find('cluster');
        let slackclusterassociation = [];
        let initialSelectedClusters = [];
        allcluster = allcluster._result.content;
        this.get('userStore').rawRequest({url:'slackclusterassociation'}).then((xhr) => {
            allslackclusterassociation = xhr.body.data;
            allslackclusterassociation.forEach(function(item){
                if(item.slackIntegrationId===slackIntegrationId){
                    slackclusterassociation.push(item);
                }
            });
            let clustersWithOptions = [];
            let id = 0;
            let temp;
            allcluster.forEach(function(item){
                if(slackclusterassociation.findBy('clusterId',item.id)){
                    temp = {name:item.name, isChecked: true, resource:item,id:id};
                    clustersWithOptions.push(temp);
                    initialSelectedClusters.push(item);
                }
                else{
                    temp = {name:item.name, isChecked: false, resource:item,id:id};
                    clustersWithOptions.push(temp);
                }
                id++;
            });
            this.set('clustersWithOptions',clustersWithOptions);
            this.set('initialSelectedClusters',initialSelectedClusters);
            this.set('finalSelectedClusters',initialSelectedClusters);
            this.set('initialSlackClusterAssociation',slackclusterassociation);
        });
    },
    actions:{
        updateClustersWithOptions(param){
            let previousselectedcluster = this.get('clustersWithOptions');
            let clustersWithOptions = [];
            let finalSelectedClusters = [];
            let temp;
            previousselectedcluster.forEach(function(item){
                if(item.id===param.id){
                    temp = {name:item.name, isChecked:!item.isChecked, resource:item.resource,id:item.id};
                    clustersWithOptions.push(temp);
                }else{
                    clustersWithOptions.push(item);
                }
            });
            clustersWithOptions.forEach(function(item){
                if(item.isChecked){
                    finalSelectedClusters.push(item.resource);
                }
            });
            this.set('clustersWithOptions',clustersWithOptions);
            this.set('finalSelectedClusters',finalSelectedClusters);
        },
        save(){
            let updatedSelected = this.get('finalSelectedClusters');
            let selected = this.get('initialSelectedClusters');
            let deleteRelation = [];
            let addRelation = [];
            let deleteRelationCluster = [];
            selected.forEach(function(item){
                if(!updatedSelected.findBy('id',item.id)){
                    deleteRelationCluster.push(item);
                }
            });
            updatedSelected.forEach(function(item){
                if(!selected.findBy('id',item.id)){
                    addRelation.push(item);
                }
            });
            let relations = this.get('initialSlackClusterAssociation');
            relations.forEach(function(item){
                if(deleteRelationCluster.findBy('id',item.clusterId)){
                    deleteRelation.push(item);
                }
            });
            let currentorgid = this.get('session').get('currentOrgId');
            let slackintid = this.get('slackIntegrationId');
            let slackclusterassociation = this.get('slackclusterassociation');
            let action=[];
            action.push('delete');
            action.push('add');
            action.forEach(actionAlert);
            function actionAlert(action){
                if(action === 'delete'){
                    deleteRelation.forEach(function(item){
                        slackclusterassociation.deleteSlackInt(item.id);
                    });
                }else if(action === 'add'){
                    addRelation.forEach(function(item){
                        slackclusterassociation.createSlackInt(item.id,currentorgid,slackintid);
                    });
                }
            }
            this.get('router').transitionTo('mayasecure.organizations');
        }
    }


});
