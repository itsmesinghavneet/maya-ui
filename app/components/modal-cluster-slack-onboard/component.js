import Ember from 'ember';
import ModalBase from 'ui/mixins/modal-base';

export default Ember.Component.extend(ModalBase, {
    model: Ember.computed.alias('modalService.modalOpts'),
    classNames: ['modal-container', 'modal-dialog', 'modal-lg'],
    session: Ember.inject.service(),
    slackclusterassociation: Ember.inject.service(),
    clusterId : null,
    slackintegrations : null,
    selectedslackcard : null,
    slackcard : null,

    tags: [],
    init() {
        this._super(...arguments);
        let clusterId = this.get('model').clusterId;
        let slackintegrations = this.get('model').slackintegrations._result.content;
        let temp;
        let id = 0;
        this.set('clusterId',clusterId);
        alert(this.get('clusterId'));
        this.set('slackintegrations',slackintegrations);
        let slackcard = [];
        this.get('slackintegrations').forEach(function(item){
            temp = {name:item.name, isChecked: false, resource:item,id:id};
            slackcard.push(temp);
            id +=1;
        });
        this.set('slackcard',slackcard);

    },
    actions: {
        updateClustersWithOptions(param){
            let slackcard = this.get('slackcard');
            let updatedSlackcard = [];
            let temp;
            slackcard.forEach(function(item){
                if(item.id===param.id){
                    temp = {name:item.name, isChecked:!item.isChecked, resource:item.resource,id:item.id};
                    updatedSlackcard.push(temp);
                }else{
                    updatedSlackcard.push(item);
                }
            });
            this.set('slackcard',updatedSlackcard);
        },
        close: function () {
            this.send('cancel');
        },
        save(){
            let currentorgId = this.get('session').get('currentOrgId');
            let clusterId = this.get('clusterId');
            let slackclusterassociation = this.get('slackclusterassociation');

            let slackcard = this.get('slackcard');
            let selectedslackcard = [];
            slackcard.forEach(function(item){
                if(item.isChecked){
                    selectedslackcard.push(item.resource);
                }
            });
            selectedslackcard.forEach(function(item){
                slackclusterassociation.createSlackInt(clusterId,currentorgId,item.id);
            });
            this.send('cancel');
        }
    },
});