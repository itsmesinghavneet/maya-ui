import Ember from 'ember';
import ModalBase from 'ui/mixins/modal-base';
import { alternateLabel } from 'ui/utils/platform';

export default Ember.Component.extend(ModalBase, {
    classNames: [''],
    resources: Ember.computed.alias('modalService.modalOpts.model'),
    alternateLabel: alternateLabel,

    actions: {
        evacuate: function() {
            this.get('resources').forEach((resource) => {
                resource.doAction('evacuate');
            });

            Ember.run.next(() => {
                this.send('cancel');
            });
        }
    }
});
