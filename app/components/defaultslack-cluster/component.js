import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Component.extend({
    session  : Ember.inject.service(),
    userStore :Ember.inject.service(),
    slack :Ember.inject.service(),
    slackclusterassociation: Ember.inject.service(),
    modalService: Ember.inject.service('modal'),
    clusterId : null,
    organizationId : null,
    defaultSlackCard : null,
    allSlackCard: null,
    init(){
        this._super(...arguments);
        this.set('clusterId',this.get('cluster').id);
        this.set('organizationId',this.get('session').get('currentOrgId'));
        let slackCard = this.get('userStore').find('slackintegration');
        slackCard = slackCard._result.content;
        let otherCard = [];
        slackCard.forEach(function(item){
            if(item.kind !== 'default'){
                otherCard.push(item);
            }
        });
        this.set('allSlackCard',otherCard);
        slackCard = slackCard.findBy('kind','default');
        this.set('defaultSlackCard',slackCard);
        let tabSession = this.get('tab-session');
        if(tabSession.get('automateSlackCluster')){
            let tabSession = this.get('tab-session');
            let currentorgid = this.get('organizationId');
            let slackintid = tabSession.get('automateSlackId');
            let clusterid = this.get('clusterId');
            this.get('slackclusterassociation').createSlackInt(clusterid,currentorgid,slackintid).then((/*res*/)=>{
                $.notify({
                    message: 'Cluster '+this.get('cluster').name+' is integrated with slack card'
                },{
                    type: 'success'
                });
                this.sendAction('goToDefaultProjectproject');
            });
        }
    },
    willDestroyElement() { 
        this._super(...arguments);
        this.cancelRefresh();
        let tabSession = this.get('tab-session');
        tabSession.set('automateSlackCluster',false);
        tabSession.set('automateSlackId',null);
    },
    scheduleRefresh(){
        this.cancelRefresh();
        this.set('refreshTimer', Ember.run.later(this, 'refreshSig', 1000));
    },
    cancelRefresh(){
        Ember.run.cancel(this.get('refreshTimer'));
    },
    refreshSig(){
        if (this.get('modalService').modalVisible) {
            this.scheduleRefresh();
        }else{
            this.send('doItLatter');
        }
    },
    actions:{
        connectToDefault(){
            let currentorgid = this.get('organizationId');
            let slackintid = this.get('defaultSlackCard').id;
            let clusterid = this.get('clusterId');
            this.get('slackclusterassociation').createSlackInt(clusterid,currentorgid,slackintid).then((/*res*/)=>{
                $.notify({
                    message: 'Cluster '+this.get('cluster').name+' is integrated with '+this.get('defaultSlackCard').name +' slack card'
                },{
                    type: 'success'
                }); 
            });
            this.sendAction('goToDefaultProjectproject');
        },
        createNewslackcard(){
            let tabSession = this.get('tab-session');
            tabSession.set('automateSlackCluster',true);
            this.set(`tab-session.${C.TABSESSION.PROJECT}`, null);
            this.get('session').set('redirectUrl', window.location.href);
            this.get('session').set('slackOauthRedirect',false);
            var provider = 'slackconfig';
            this.get('session').set('authProvider', provider);
            Ember.run.later(() => {
                this.get('slack').authorizeRedirect();
            });
        },
        selectExistingCard(){
            let slackintegrations = this.get('userStore').find('slackintegration');
            let clusterId = this.get('cluster').id;
            this.get('modalService').toggleModal('modal-cluster-slack-onboard',
                 Ember.Object.create({
                     slackintegrations: slackintegrations,
                     clusterId: clusterId
                 }));
            this.scheduleRefresh();
        },
        doItLatter(){
            this.sendAction('goToDefaultProjectproject');
        }
    }
});
