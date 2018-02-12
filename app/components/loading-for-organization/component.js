import Ember from 'ember';

export default Ember.Component.extend({
    userStore: Ember.inject.service(),
    session : Ember.inject.service(),
    setupCredential : null,
    setupIngressAuth : null,
    setupMonitoring : null,
    setupAlerting :null,
    refreshTimer: null,
    init(){
        this._super(...arguments);
        let state = this.get('userStore').find('organization',this.get('session').get('currentOrgId'));
        let message = state._result.statusMessage;
        if(message){
            this.set('setupCredential',message.setupCredential);
            this.set('setupIngressAuth',message.setupIngressAuth);
            this.set('setupMonitoring',message.setupMonitoring); 
            this.set('setupAlerting',message.setupAlerting); 
        }
        this.scheduleRefresh();
    },
    willDestroyElement() {
        this._super(...arguments);
        this.cancelRefresh();
    },
    cancelRefresh() {
        Ember.run.cancel(this.get('refreshTimer'));
    },
    scheduleRefresh() {
        this.cancelRefresh();
        this.set('refreshTimer', Ember.run.later(this, 'refreshOrganization', 1000));
    },
    refreshOrganization(){
        let state = this.get('userStore').find('organization',this.get('session').get('currentOrgId'));
        let message = state._result.statusMessage;
        if(message){
            this.set('setupCredential',message.setupCredential);
            this.set('setupIngressAuth',message.setupIngressAuth);
            this.set('setupMonitoring',message.setupMonitoring);
            this.set('setupAlerting',message.setupAlerting);
        }
        state = state._result.state;
        if( state === 'active'){
            this.cancelRefresh();
            this.get('session').set('currentOrgState',state);
            this.sendAction('updateState');
        } else{
            this.scheduleRefresh();
        }
    },
});
