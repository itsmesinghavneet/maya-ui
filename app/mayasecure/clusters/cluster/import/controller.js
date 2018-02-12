import Ember from 'ember';
export default Ember.Controller.extend({
    intl: Ember.inject.service(),
    modalService: Ember.inject.service('modal'),
    userStore: Ember.inject.service('user-store'),
    projects: Ember.inject.service(),
    session: Ember.inject.service(),
    clusterController: Ember.inject.controller('mayasecure.clusters.cluster'),
    cluster: Ember.computed.alias('clusterController.model'),
    loading: Ember.computed.alias('cluster.isTransitioning'),
    importCommand: Ember.computed.alias('cluster.registrationToken.clusterCommand'),
    installCommand: Ember.computed.alias('cluster.registrationToken.clusterOpenebsCommand'),
    importOCCommand: Ember.computed.alias('cluster.registrationToken.clusterOCCommand'),
    installOCCommand: Ember.computed.alias('cluster.registrationToken.clusterOCOpenebsCommand'),
    commandType : 'importCommand',
    refreshTimer: null,
    goToProject: false,
    activeCluster: 'openebs-cluster-card-active',
    activeOpenEbsCluster: null,
    activeOpenShiftCluster: null,
    activeOpenShiftOpenEbsCluster: null,
    init() {
        this._super(...arguments);
        let cluster = this.get('cluster');
        let currentOrganizationState = this.get('session').get('currentOrgState');
        if (currentOrganizationState === 'active') {
            if (cluster.state !== 'active') {
                this.scheduleRefresh();
            } else {
                //    this.send('cancel');
            }
        } else {
            this.transitionToRoute('mayasecure');
        }
    },

    willDestroyElement() {
        this.cancelRefresh();
    },

    cancelRefresh() {
        Ember.run.cancel(this.get('refreshTimer'));
    },

    scheduleRefresh() {
        this.cancelRefresh();
        this.set('refreshTimer', Ember.run.later(this, 'refreshCluster', 5000));
    },

    goToDefaultProjectproject(projectid){
        if(this.get('goToProject')){
            if ((this.get('cluster').state === 'active') || (this.get('cluster').state === 'activating')) {
                this.send('switchProject', projectid, 'mayaapplications', [projectid]);
            }
        }
    },

    refreshCluster() {
        let cluster = this.get('cluster');
        let projects;
        let defaultProject;
        cluster.reload().then(() => {
            if (cluster.get('state') === 'removed') {
                this.transitionToRoute('mayasecure');
            } else if (cluster.get('state') === 'creating'){
                this.scheduleRefresh();
            } else if (cluster.get('state') === 'inactive') {
                this.scheduleRefresh();
            } else {
                this.get('userStore').rawRequest({
                    url: 'projects'
                }).then((xhr) => {
                    projects = xhr.body.data;
                    projects.forEach(function(item){
                        if(item.name==='Default' && item.state === 'active' && item.clusterId === cluster.id){
                            defaultProject = item;
                        }
                    });
                    this.goToDefaultProjectproject(defaultProject.id);
                });
            }
        }).catch(() => {
            this.scheduleRefresh();
        });
    },

    actions: {
        goToDefaultProjectproject(){
            this.set('goToProject',true);
            this.refreshCluster();
        },
        startRefresh(){
            let currentOrganizationState = this.get('session').get('currentOrgState');
            let cluster = this.get('cluster');
            if (currentOrganizationState === 'active') {
                if(cluster.state !=='active'){
                    //this.send('importdialog');
                    this.scheduleRefresh();
                }
            } else {
                this.transitionToRoute('mayasecure');
            }
        },
        stopRefresh(){
            let tabSession = this.get('tab-session');
            if(tabSession.get('clusterCteate')){
                tabSession.set('clusterCteate',false);
            }
            this.set('commandType','importCommand');
            this.set('activeCluster','openebs-cluster-card-active');
            this.set('activeOpenEbsCluster',null);
            this.set('activeOpenShiftCluster',null);
            this.set('activeOpenShiftOpenEbsCluster',null);
            this.cancelRefresh();
        },
        importdialog() {
            this.set('activeOpenEbsCluster',null);
            this.set('activeCluster','openebs-cluster-card-active');
            this.set('activeOpenShiftCluster',null);
            this.set('activeOpenShiftOpenEbsCluster',null);
            this.set('commandType','importCommand');
        },

        installdialog() {
            this.set('activeOpenEbsCluster','openebs-cluster-card-active');
            this.set('activeCluster',null);
            this.set('activeOpenShiftCluster',null);
            this.set('activeOpenShiftOpenEbsCluster',null);
            this.set('commandType','installCommand');
        },

        importOpenShist(){
            this.set('activeOpenEbsCluster',null);
            this.set('activeCluster',null);
            this.set('activeOpenShiftCluster','openebs-cluster-card-active');
            this.set('activeOpenShiftOpenEbsCluster',null);
            this.set('commandType','importOCCommand');
        },

        installOpenShift(){
            this.set('activeOpenEbsCluster',null);
            this.set('activeCluster',null);
            this.set('activeOpenShiftCluster',null);
            this.set('activeOpenShiftOpenEbsCluster','openebs-cluster-card-active');
            this.set('commandType','installOCCommand');
        },

        hostSet() {
            this.set('model.apiHostSet', true);
        },

        cancel() {
            this.transitionToRoute('mayasecure.clusters');
        }
    },

    configSet: function () {
        return (this.get('kubeconfig') || '').includes('clusters:');
    }.property('kubeconfig'),
});