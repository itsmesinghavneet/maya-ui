import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        done() {
            this.send('goToPrevious','mayasecure.clusters');
        },

        cancel() {
            this.send('goToPrevious','mayasecure.clusters');
        },
        setSelection: function(selected) {
            this.get('model.cluster').set('provider',selected);
        },
        showproviderlist(){
            $('#provider-change-btn').hide();
            $('#provider-select').removeClass('d-none');
        },
    },
});
