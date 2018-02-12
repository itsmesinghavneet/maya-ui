import Ember from 'ember';
export default Ember.Controller.extend({
    volumename : null,
    showvolumes : true,
    init(){
        this._super(...arguments);
    },
    actions:{
        changeVolume(param){
            this.set('volumename',param);
            if(!this.get('showvolumes')){
                this.set('showvolumes',true);
            }
        },
        stateChange(){
            if(this.get('showvolumes')){
                this.set('showvolumes',false);
            }
        }
    }
});
