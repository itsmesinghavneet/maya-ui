import Ember from 'ember';

export default Ember.Route.extend({
    session  : Ember.inject.service(),
    model: function() {
        var userStore = this.get('userStore');
        let currentOrganization ;
        let currentOrgId = this.get('session').get('currentOrgId');
        return Ember.RSVP.hash({
            organizations: userStore.find('organization', null, {url: 'organization',forceReload: true, removeMissing: true}),
            slackintegrations: userStore.find('slackintegration', null, {url: 'slackintegrations',forceReload: true, removeMissing: true}),
            clusters: userStore.find('cluster', null, {url: 'cluster',forceReload: true, removeMissing: true}),
            identities : userStore.find('identity', null, {url: 'identities',forceReload: true, removeMissing: true}),
        }).then(() => {
            let organization = userStore.find('organization');
            let organizations = organization._result.content;
            organizations.forEach(function(item){
                if(item.id===currentOrgId){
                    currentOrganization = item;
                }
            });
            return {
                organizations: userStore.all('organization'),
                identities : userStore.all('identity'),
                slackintegrations: userStore.all('slackintegration'),
                clusters: userStore.all('cluster'),
                currentOrganization : currentOrganization,

            };
        });
    },
});
