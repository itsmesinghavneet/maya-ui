import Ember from 'ember';

export default Ember.Controller.extend({
    projects: Ember.inject.service(),
    mayaApp: null,
    grafanaUrl: null,
    refreshTimer: null,
    init() {
        this._super(...arguments);
        this.get('userStore').rawRequest({
            url: 'organizations'
        }).then((xhr) => {
            this.set('grafanaUrl', xhr.body.data[0].grafanaUrl);
        });
        let defproId = this.get('projects').current.id;
        this.get('userStore').rawRequest({
            url: 'projects/' + defproId + '/mayaapplications'
        }).then((xhr) => {
            this.set('mayaApp', xhr.body.data);
        });
        this.scheduleRefresh();
    },
    scheduleRefresh() {
        this.set('refreshTimer', Ember.run.later(this, 'refreshApplication', 5000));
    },
    refreshApplication() {
        let defproId = this.get('projects').current.id;
        this.get('userStore').rawRequest({
            url: 'projects/' + defproId + '/mayaapplications'
        }).then((xhr) => {
            this.set('mayaApp', xhr.body.data);
        });
        this.scheduleRefresh();
    },
});