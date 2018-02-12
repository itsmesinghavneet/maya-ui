import Ember from 'ember';
export default Ember.Component.extend({
    modalService: Ember.inject.service('modal'),
    filteredCard: Ember.computed.filter('slackmodel', function (slackmodel) {
        var searchFilter = this.get('searchFilter');
        var regex = new RegExp(searchFilter, 'i');
        let strName = slackmodel.name;
        let strTeam = slackmodel.token.teamName;
        let strChannel = slackmodel.token.incomingWebhook.channel;
        let strPatName = JSON.stringify(strName);
        let strPatTeam = JSON.stringify(strTeam);
        let strPatChannel = JSON.stringify(strChannel);
        return ( strPatName.match(regex) || strPatTeam.match(regex) || strPatChannel.match(regex) );
        
    }).property('slackmodel.[]','slackmodel.@each.state','searchFilter'),
    searchFilter: '',
    actions:{
        deleteslackCard(item){
            let resource = [];
            resource.push(item);
            this.get('modalService').toggleModal('confirm-delete',{resources:resource});
            
        },
        editslackCard(item){
            this.get('router').transitionTo('mayasecure.organizations.slackconfigure',item);
        },
        handleFilterEntry() {
            let str = this.get('value');
            this.set('searchFilter', str);
        },
    }
});
