import Ember from 'ember';
export default Ember.Route.extend({
    userStore: Ember.inject.service(),
    session: Ember.inject.service(),
    model: function(param) {
        let slackintegration = this.get('userStore').find('slackintegration',param.slackintegration_id);
        let organization = this.get('userStore').find('organization',this.get('session').get('currentOrgId'));
        return{
            organization : organization._result,
            paramid : param.slackintegration_id,
            slackintegration : slackintegration._result,
        };
    },
}); 