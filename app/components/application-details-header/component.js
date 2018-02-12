import Ember from 'ember';

export default Ember.Component.extend({
    noOfPods : null,
    noOfVol : null,
    init(){
        this._super(...arguments);
        let pod,podCount,volCount,i;
        try{
            pod = this.get('model').data.pods;
            podCount = pod.length;
            volCount = 0;
            for(i=0;i<pod.length;i++){
                volCount += pod[i].volumes.length;
            }
            this.set('noOfPods',podCount);
            this.set('noOfVol',volCount);
        }catch(err){
            console.log(err);
        }
    }
});
