import Ember from 'ember';

export default Ember.Component.extend({
    init(){
        this._super(...arguments );
        var obj = this.get('model.organizations');
        if (obj.content.length===0){
            location.replace('clusters');
        }
    },
});
