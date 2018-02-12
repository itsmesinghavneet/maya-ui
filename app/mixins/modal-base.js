import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Mixin.create({
    classNames: [''],

    modalService: Ember.inject.service('modal'),
    modalOpts: Ember.computed.alias('modalService.modalOpts'),
    keyUp(e) {
        if (e.which === C.KEY.ESCAPE && this.escToClose()) {
            this.get('modalService').toggleModal();
        }
    },

    escToClose() {
        var modalService = this.get('modalService');
        if (modalService.get('modalVisible') && modalService.get('modalOpts.escToClose')) {
            return true;
        } else {
            return false;
        }
    },
    actions: {
        cancel() {
            this.get('modalService').toggleModal();
        },
    },
});
