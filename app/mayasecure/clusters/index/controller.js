import Ember from 'ember';
import C from 'ui/utils/constants';
//const { getOwner } = Ember;
export default Ember.Controller.extend({
    modalService: Ember.inject.service('modal'),
    access: Ember.inject.service(),
    projects: Ember.inject.service(),
    settings: Ember.inject.service(),
    session : Ember.inject.service(),
    'tab-session'   : Ember.inject.service(),
    application: Ember.inject.controller(),
    currentOrganizationState : null,
    init() {
        this._super(...arguments);
        this.set(`tab-session.${C.TABSESSION.PROJECT}`, null);
        this.set('expandedClusters',[]);
        this.set('currentOrganizationState',this.get('session').get('currentOrgState'));
    },
    actions: {
        toggleExpand(id) {
            let list = this.get('expandedClusters');
            if ( list.includes(id) ) {
                list.removeObject(id);
            } else {
                list.addObject(id);
            }
        },
        launchOnCluster(/*model*/)
        {
            this.transitionToRoute('mayasecure.clusters');
        },
        updateState(){
            this.set('currentOrganizationState',this.get('session').get('currentOrgState'));
        },
    },
});
