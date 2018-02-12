import Ember from 'ember';
import C from 'ui/utils/constants';
export default Ember.Component.extend({	
    grafanaUrl :null,
    grafanaUrlVol : null,
    noOfPods : null,
    noOfVol : null,
    init(){
        this._super(...arguments);
        let pod = this.get('data');
        let podCount = pod.length;
        let volCount = 0;
        let i=0;
        for(i=0;i<pod.length;i++){
            volCount += pod[i].volumes.length;
        }
        this.set('noOfPods',podCount);
        this.set('noOfVol',volCount);
        this.set('grafanaUrl',this.get('grafanaUrl'));
        this.set('grafanaUrlVol',this.get('grafanaUrl')+'/dashboard/db/'+C.GRAFANA_LINK.DASHBOARD_NAME+C.GRAFANA_LINK.ORG_ID_GRAFANA);
    }
});