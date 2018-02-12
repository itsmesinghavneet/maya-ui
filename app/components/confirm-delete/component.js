import Ember from 'ember';
import ModalBase from 'ui/mixins/modal-base';
import C from 'ui/utils/constants';
export default Ember.Component.extend(ModalBase, {
    resourceType : null,
    resourceName : null,
    classNames: ['modal-container', 'modal-dialog'],
    resources: Ember.computed.alias('modalService.modalOpts.resources'),
    intl: Ember.inject.service(),
    projects: Ember.inject.service(),
    init(){
        this._super(...arguments);
        this.get('resources').forEach((resource) => {
            if(!resource.cb){
                this.set('resourceType',resource.type);
                this.set('resourceName',resource.name);
            }
        });
    },
    actions: {
        confirm: function () {
            this.get('resources').forEach((resource) => {
                if (resource.cb) {
                    resource.cb();
                } else {
                    resource.delete();
                    if (resource.type === 'cluster') {
                        this.set(`tab-session.${C.TABSESSION.PROJECT}`, null);
                    }
                }
            });
            this.send('cancel');
        },
    },
    close: function () {
        this.send('cancel');
    }
});