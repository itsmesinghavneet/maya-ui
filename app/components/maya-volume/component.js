import Ember from 'ember';
export default Ember.Component.extend({	
    grafanaUrl :null,
    grafanaUrlVol : null,
    init(){
        this._super(...arguments);
        this.get('userStore').rawRequest({url:'organizations'}).then((xhr) => {
            this.set('grafanaUrl',xhr.body.data[0].grafanaUrl);
            this.set('grafanaUrlVol',this.get('grafanaUrl')+'&var-OpenEBS=');
            // TODO fetch perticular grafana link
        });
    },
    actions:{
        changeVolume(param){
            this.sendAction('changeVolume',param);
        }
    }
});



