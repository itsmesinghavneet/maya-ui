import Ember from 'ember';
import Resource from 'ember-api-store/models/resource';
import PolledResource from 'ui/mixins/cattle-polled-resource';

var Cluster = Resource.extend(PolledResource, {
    userStore: Ember.inject.service('user-store'),

    type: 'cluster',

    actions: {
        edit() {
            this.get('router').transitionTo('mayasecure.clusters.cluster.edit', this.get('id'));
        }
    },

    _allProjects: null,
    init() {
        this._super(...arguments);
        this.set('_allProjects', this.get('userStore').all('project'));
    },

    projects: function() {
        return this.get('_allProjects').filterBy('clusterId', this.get('id'));
    }.property('_allProjects.@each.clusterId'),

    defaultProject: function() {
        let projects = this.get('projects');

        let out = projects.findBy('name','Default');

        if ( !out ) {
            out = projects.findBy('clusterOwner', true);
        }

        if ( !out ) {
            out = projects.objectAt(0);
        }

        return out;
    }.property('projects.@each.{name,clusterOwner}'),

    systemProject: function() {
        return this.get('projects').findBy('clusterOwner', true);
    }.property('projects.@each.{clusterOwner}'),

    availableActions: function() {
        //    let a = this.get('actionLinks');
        let l = this.get('links');

        var choices = [
            { label: 'action.edit',             icon: 'icon icon-edit',         action: 'edit',         enabled: !!l.update },
            { divider: true },
            //      { label: 'action.activate',         icon: 'icon icon-play',         action: 'activate',     enabled: !!a.activate},
            //      { label: 'action.deactivate',       icon: 'icon icon-pause',        action: 'promptStop',   enabled: !!a.deactivate, altAction: 'deactivate'},
            //      { divider: true },
            { label: 'action.remove',           icon: 'icon icon-trash',        action: 'promptDelete', enabled: !!l.remove, altAction: 'delete' },
            { divider: true },
            { label: 'action.viewInApi',        icon: 'icon icon-external-link',action: 'goToApi',      enabled: true },
        ];

        return choices;
    }.property('actionLinks.{activate,deactivate}','links.{update,remove}'),

    // @TODO real data
    numHosts: function() {
        return 3+Math.round(Math.random()*2);
    }.property(),

    numCores: function() {
        return this.get('numHosts')*8;
    }.property('numHosts'),

    numGhz: function() {
        return 3.4*this.get('numCores');
    }.property('numCores'),

    numMem: function() {
        return 8*this.get('numHosts');
    }.property('numHosts'),

    numStorage: function() {
        return 40*this.get('numHosts');
    }.property('numHosts'),
});

Cluster.reopenClass({
    pollTransitioningDelay: 1000,
    pollTransitioningInterval: 5000,
});

export default Cluster;
 
