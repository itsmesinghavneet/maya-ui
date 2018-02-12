import Ember from 'ember';

export default Ember.Component.extend({
    actions:{
        importCluster(){
            this.sendAction('importCluster');
        }
    }
});
