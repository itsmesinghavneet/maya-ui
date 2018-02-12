import Ember from 'ember';
export default Ember.Service.extend({
    userStore: Ember.inject.service('user-store'),

    createSlackInt(cid,orgid,siid) {
        return this.get('userStore').rawRequest({
            url: 'slackclusterassociations',
            method: 'POST',
            data: {
                clusterId: cid,
                organizationId : orgid,
                slackIntegrationId : siid,
            },
        }).then((xhr) => {
            return xhr.body;
        }).catch((/*res*/) => {
            location.replace('organization/integrations');
        });
    },
    deleteSlackInt(scaid) {
        return this.get('userStore').rawRequest({
            url: 'slackclusterassociations/'+scaid,
            method: 'DELETE',
        }).then((xhr) => {
            return xhr.body;
        }).catch((/*res*/) => {
            location.replace('organization/integrations');
        });
    },
});
 








