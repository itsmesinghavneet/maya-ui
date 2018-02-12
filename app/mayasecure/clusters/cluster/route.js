import Ember from 'ember';
export default Ember.Route.extend({
    storeReset: Ember.inject.service(),
    model(params /*,transition*/ ) {
        this.get('userStore').rawRequest({
            url: 'clusters/' + params.cluster_id
        }).then((xhr) => {
            if (xhr.body.state === 'removed') {
                this.get('storeReset').reset();
                this.transitionTo('mayasecure');
            }
        });
        return this.get('userStore').find('cluster', params.cluster_id);
    },
});
