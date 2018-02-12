import Ember from 'ember';
export default Ember.Route.extend({
    model: function(param) {
        let slackintegration = this.get('userStore').find('slackintegration',param.slackintegration_id);
        return{
            paramid : param.slackintegration_id,
            slackintegration : slackintegration._result,
        };
    },
}); 