import Ember from 'ember';
//import C from 'ui/utils/constants';

export default Ember.Route.extend({
    titleToken: 'Clusters',
    storeReset: Ember.inject.service(),
    model: function () {
        var userStore = this.get('userStore');
        return Ember.RSVP.hash({
            projects: userStore.find('project', null, {
                url: 'projects',
                filter: {
                    all: 'true'
                },
                forceReload: true,
                removeMissing: true
            }),
            clusters: userStore.find('cluster', null, {
                url: 'clusters',
                forceReload: true,
                removeMissing: true
            }),
            organizations: userStore.find('organization', null, {
                url: 'organization',
                forceReload: true,
                removeMissing: true
            }),
            slackintegrations: userStore.find('slackintegration', null, {
                url: 'slackintegration',
                forceReload: true,
                removeMissing: true
            }),
            slackclusterassociations: userStore.find('slackclusterassociation', null, {
                url: 'slackclusterassociation',
                forceReload: true,
                removeMissing: true
            })
        }).then(() => {
            return {
                projects: userStore.all('project'),
                clusters: userStore.all('cluster'),
                organizations: userStore.all('organization'),
                slackintegrations: userStore.all('slackintegration'),
                slackclusterassociations: userStore.all('slackclusterassociation')
            };
        });
    },
});