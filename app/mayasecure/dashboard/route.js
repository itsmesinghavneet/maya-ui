import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Route.extend({
    titleToken: 'Dashboard',
    storeReset: Ember.inject.service(),
    slack: Ember.inject.service(),
    settings: Ember.inject.service(),
    mayafancyname: Ember.inject.service(),
    session  : Ember.inject.service(),
    model: function () {
        var userStore = this.get('userStore');
        return Ember.RSVP.hash({
            clusters: userStore.find('cluster', null, {
                url: 'clusters',
                forceReload: true,
                removeMissing: true
            }),
        }).then(() => {
            return {
                clusters: userStore.all('cluster'),
                organization: userStore.find('organization',this.get('session').get('currentOrgId'))._result,
                account: userStore.find('account',this.get('session').get(C.SESSION.ACCOUNT_ID))._result,
            };
        });
    },
    actions:{
        importCluster() {
            let store = this.get('userStore');
            let def = JSON.parse(this.get(`settings.${C.SETTING.CLUSTER_TEMPLATE}`)) || {};
            def.type = 'cluster';
            let cluster = store.createRecord(def);
            cluster.set('name',this.get('mayafancyname').generateName());
            cluster.set('organizationId',this.get('session').get('currentOrgId'));
            cluster.save().then((param) => {
                this.transitionTo('mayasecure.clusters.cluster.import',param.id);
            });
        },
        slackOauth(){
            this.get('session').set('isDefaultSlackCard',true);
            this.get('session').set('redirectUrl', window.location.href);
            this.get('session').set('slackOauthRedirect',false);
            var provider = 'slackconfig';
            this.get('session').set('authProvider', provider);
            Ember.run.later(() => {
                this.get('slack').authorizeRedirect();
            }, 10);
        }
    }
});