import Ember from 'ember';
import C from 'ui/utils/constants';
import { parseExternalId } from 'ui/utils/parse-externalid';

export default Ember.Route.extend({
    settings: Ember.inject.service(),
    catalog: Ember.inject.service(),

    model() {
        let store = this.get('store');
        let catalog = this.get('catalog');
        let deps = [];

        let cluster = this.modelFor('mayasecure.clusters.cluster').clone();
        if ( cluster.systemStacks === null ) {
            let def = JSON.parse(this.get(`settings.${C.SETTING.CLUSTER_TEMPLATE}`)) || {};
            cluster.set('systemStacks', (def.systemStacks||[]).map((stack) => {
                stack.type = 'stack';
                let extInfo = parseExternalId(stack.externalId);
                deps.push(catalog.fetchTemplate(extInfo.templateId, false));
                return store.createRecord(stack);
            }));
        }

        return Ember.RSVP.allSettled(deps).then(() => {
            return Ember.Object.create({
                cluster
            });
        });
    },
});
 
