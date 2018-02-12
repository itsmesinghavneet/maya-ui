import Ember from 'ember';
import ModalBase from 'ui/mixins/modal-base';
export default Ember.Component.extend(ModalBase, {
    model: Ember.computed.alias('modalService.modalOpts'),
    classNames: ['modal-container', 'modal-dialog', 'modal-lg'],
    session: Ember.inject.service(),
    init() {
        this._super(...arguments);
        this.set('value', this.get('model.obj.value') || '');
    },
    actions: {
        close: function () {
            this.send('cancel');
        }
    }
});