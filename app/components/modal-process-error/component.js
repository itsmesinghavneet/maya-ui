import Ember from 'ember';
import ModalBase from 'ui/mixins/modal-base';

export default Ember.Component.extend(ModalBase, {
    classNames: ['large-modal'],
    exception: Ember.computed.alias('modalService.modalOpts'),
    actions: {
        dismiss: function() {
            this.send('cancel');
        }
    },
});
