import Ember from 'ember';

export default Ember.Component.extend({
    showHeader:false,
    init(){
        this._super(...arguments);
        let tabSession = this.get('tab-session');
        if(tabSession.get('clusterCteate')){
            this.set('showHeader',true);
        }
    },
});
