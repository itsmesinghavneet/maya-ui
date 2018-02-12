import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';
import ModalBase from 'ui/mixins/modal-base';
export default Ember.Component.extend(ModalBase, NewOrEdit, {
    originalModel: Ember.computed.alias('modalService.modalOpts'),
    modalService: Ember.inject.service('modal'),
    init(){
        this._super.apply(this,arguments);
    },
    actions:{
        closePopup(){
            this.get('modalService').toggleModal();
        }
    }
});
