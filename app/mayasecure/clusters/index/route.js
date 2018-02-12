import Ember from 'ember';
import Subscribe from 'ui/mixins/subscribe';
import PromiseToCb from 'ui/mixins/promise-to-cb';
import C from 'ui/utils/constants';

export default Ember.Route.extend(Subscribe, PromiseToCb, {
    projects: Ember.inject.service(),
    settings: Ember.inject.service(),
    mayafancyname: Ember.inject.service('mayafancyname'),
    session  : Ember.inject.service(),
    actions: {
        toggleGrouping() {
            let choices = ['list', 'grouped'];
            let cur = this.get('controller.mode');
            let neu = choices[((choices.indexOf(cur) + 1) % choices.length)];
            Ember.run.next(() => {
                this.set('controller.mode', neu);
            });
        },
        importCluster() {
            let store = this.get('userStore');
            let tabSession = this.get('tab-session');
            tabSession.set('clusterCteate',true);
            let def = JSON.parse(this.get(`settings.${C.SETTING.CLUSTER_TEMPLATE}`)) || {};
            def.type = 'cluster';
            let cluster = store.createRecord(def);
            cluster.set('name',this.get('mayafancyname').generateName());
            cluster.set('organizationId',this.get('session').get('currentOrgId'));
            cluster.save().then((param) => {
                this.transitionTo('mayasecure.clusters.cluster.import',param.id);
            });
        },
        switchProject(projectId) {
            this.disconnectSubscribe(() => {
                this.send('finishSwitchProject', projectId);
            });
        },
        finishSwitchProject(projectId) {
            //console.log('Switch finishing');
            this.get('projects').selectDefault(projectId);
            location.replace('cluster/' + projectId);
        },
    },
    shortcuts: {
        'g': 'toggleGrouping',
    }
});
