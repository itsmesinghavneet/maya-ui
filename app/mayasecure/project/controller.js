import Ember from 'ember';
import C from 'ui/utils/constants';
import { tagsToArray } from 'ui/models/stack';
import Cookies from 'ember-cli-js-cookie';
//const NONE = 'none';
//const SERVICE = 'service';
const STACK = 'stack';

export default Ember.Controller.extend({
    prefs: Ember.inject.service(),
    projects: Ember.inject.service(),
    growl: Ember.inject.service(),
    modalService: Ember.inject.service('modal'),
    k8s: Ember.inject.service(),

    tags: '',
    group: STACK,
    queryParams: ['tags', 'group'],

    stacks: null,
    hosts: null,
    expandedInstances: null,
    refreshTimer: null,
    currentCluster: Ember.computed.alias('projects.currentCluster'),
    currentOrganizationName: Cookies.get('currentOrgName'),
    slackclusterassociation: null,
    slackcards: null,


    init() {
        this._super(...arguments);
        this.set('stacks', this.get('store').all('stack'));
        this.set('hosts', this.get('store').all('host'));

        // Code to display slack card.

        let currentClusterId = this.get('currentCluster').id;
        let slackclusterassociations = this.get('userStore').find('slackclusterassociation');
        let slackcard = [];
        slackclusterassociations = slackclusterassociations._result;
        slackclusterassociations.forEach(function (item) {
            if (item.clusterId === currentClusterId) {
                slackcard.push(item.slackIntegrationId);
            }
        });
        let uniqueSlackCard = [];
        slackcard.forEach(function (item) {
            if (uniqueSlackCard.indexOf(item) < 0) {
                uniqueSlackCard.push(item);
            }
        });
        let slackintegrations = this.get('userStore').find('slackintegration');
        slackintegrations = slackintegrations._result.content;
        let uniqueslackintegrations = [];
        slackintegrations.forEach(function (item) {
            if (uniqueSlackCard.indexOf(item.id) >= 0) {
                uniqueslackintegrations.push(item);
            }
        });
        this.set('slackcards', uniqueslackintegrations);
        if (this.get('slackcards').length === 0) {
            let slackintegrations = this.get('userStore').find('slackintegration');
            let clusterId = this.get('currentCluster').id;
            this.get('modalService').toggleModal('modal-cluster-slack-onboard',
                Ember.Object.create({
                    slackintegrations: slackintegrations,
                    clusterId: clusterId
                }));
        }
        this.scheduleRefresh();
        //alert(this.get('slackcards'));
        //use {{slackcard}} to display all slack cluster related to a cluster.


        this.set('expandedInstances', []);
        Ember.run.scheduleOnce('afterRender', () => {
            let key = `prefs.${C.PREFS.CONTAINER_VIEW}`;
            const group = this.get(key) || this.get('group');
            this.transitionToRoute({ queryParams: { group } });
        });
    },
    willDestroyElement() {
        this.cancelRefresh();
    },
    cancelRefresh() {
        Ember.run.cancel(this.get('refreshTimer'));
    },
    scheduleRefresh() {
        this.cancelRefresh();
        this.set('refreshTimer', Ember.run.later(this, 'refreshslaCkcard', 5000));
    },
    refreshslaCkcard() {
        if (this.get('modalService').modalVisible) {
            this.scheduleRefresh();
        } else {
            let slackclusterassociations = [];
            this.get('userStore').rawRequest({
                url: 'slackclusterassociation'
            }).then((xhr) => {
                xhr.body.data.forEach(function (item) {
                    if (item.state === 'active') {
                        slackclusterassociations.push(item);
                    }
                });
                this.set('slackclusterassociation', slackclusterassociations);
                this.refreshCard();
            });

        }
    },

    refreshCard() {
        let currentClusterId = this.get('currentCluster').id;
        let slackclusterassociations = this.get('slackclusterassociation');
        let slackcard = [];
        slackclusterassociations.forEach(function (item) {
            if (item.clusterId === currentClusterId) {
                slackcard.push(item.slackIntegrationId);
            }
        });
        let uniqueSlackCard = [];
        slackcard.forEach(function (item) {
            if (uniqueSlackCard.indexOf(item) < 0) {
                uniqueSlackCard.push(item);
            }
        });
        let slackintegrations = this.get('userStore').find('slackintegration');
        slackintegrations = slackintegrations._result.content;
        let uniqueslackintegrations = [];
        slackintegrations.forEach(function (item) {
            if (uniqueSlackCard.indexOf(item.id) >= 0) {
                uniqueslackintegrations.push(item);
            }
        });
        this.set('slackcards', uniqueslackintegrations);
        if (this.get('slackcards').length > 0) {
            //this.get('growl').message('Cluster successfully added to slack channel');
            return;
        }
    },


    actions: {
        toggleExpand(instId) {
            let list = this.get('expandedInstances');
            if (list.includes(instId)) {
                list.removeObject(instId);
            } else {
                list.addObject(instId);
            }
        },
        dashboard() {
            window.open(this.get('k8s.kubernetesDashboard'), '_blank');
        },
        slackConfiguration() {
            let slackintegrations = this.get('userStore').find('slackintegration');
            let clusterId = this.get('currentCluster').id;
            this.get('modalService').toggleModal('modal-cluster-slack-onboard',
                Ember.Object.create({
                    slackintegrations: slackintegrations,
                    clusterId: clusterId,
                }));
        },
    },
    showClusterWelcome: function () {
        return this.get('projects.currentCluster.state') === 'inactive' && !this.get('hosts.length');
    }.property('projects.currentCluster.state', 'hosts.[]'),

    simpleMode: false,
    /*
  simpleMode: function() {
  let list = this.get('stacks');
  if ( !this.get('prefs.showSystemResources') ) {
  list = list.filterBy('system', false);
  }
  
  let bad = list.findBy('isDefault', false);
  return !bad;
  }.property('stacks.@each.{system,isDefault}','prefs.showSystemResources'),
  */

    groupTableBy: function () {
        if (this.get('group') === STACK && !this.get('simpleMode')) {
            return 'stack.id';
        } else {
            return null;
        }
    }.property('simpleMode', 'group'),

    preSorts: function () {
        if (this.get('groupTableBy')) {
            return ['stack.isDefault:desc', 'stack.displayName'];
        } else {
            return null;
        }
    }.property('groupTableBy'),

    showStack: function () {
        let needTags = tagsToArray(this.get('tags'));
        let simpleMode = this.get('simpleMode');

        let out = {};
        let ok;
        this.get('stacks').forEach((obj) => {
            ok = true;
            if (!this.get('prefs.showSystemResources') && obj.get('system') !== false) {
                ok = false;
            }

            if (ok && !simpleMode && !obj.hasTags(needTags)) {
                ok = false;
            }

            if (ok && obj.get('type').toLowerCase() === 'kubernetesstack') {
                ok = false;
            }

            out[obj.get('id')] = ok;
        });

        return out;
    }.property('stacks.@each.{grouping,system}', 'tags', 'prefs.showSystemResources', 'simpleMode'), // Grouping is used for tags

    emptyStacks: function () {
        return this.get('stacks').filterBy('isEmpty', true).map((x) => { return { ref: x }; });
    }.property('stacks.@each.isEmpty'),

    groupChanged: function () {
        let key = `prefs.${C.PREFS.CONTAINER_VIEW}`;
        let cur = this.get(key);
        let neu = this.get('group');
        if (cur !== neu) {
            this.set(key, neu);
        }
    }.observes('group'),
});
