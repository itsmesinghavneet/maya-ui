import Ember from 'ember';
import ModalBase from 'ui/mixins/modal-base';
import C from 'ui/utils/constants';
let exitSignal = 0;
let mailCount = 0;
let mailSentCount=0;
let mailNotSentCount=0;
let error='';
export default Ember.Component.extend(ModalBase, {
    intl: Ember.inject.service(),
    model: Ember.computed.alias('modalService.modalOpts'),
    classNames: ['modal-container', 'modal-dialog'],
    session: Ember.inject.service(),
    growl: Ember.inject.service(),
    tags: [],
    init() {
        this._super(...arguments);
        this.set('value', this.get('model.obj.value') || '');
        mailCount=this.get('tags').length;
        mailSentCount=0;
        mailNotSentCount=0;
        error=[this.get('intl').t('invite.subHeader.subHeader3'),this.get('intl').t('invite.subHeader.subHeader4')];
    },
    actions: {
        invite() {
            let currentUserId = this.get('session').get(C.SESSION.ACCOUNT_ID);
            let textField = this.get('tags');
            mailCount=this.get('tags').length;
            const totalInvitee=mailCount;
            if (textField.length < 1) {
                $('#notify').html(error[0]);
            } else {
                for (let i = 0; i < textField.length; i++) {
                    let email = textField[i];
                    let putUrl=this.get('intl').t('invite.putUrl',{id:currentUserId, inviteeEmail:email});
                    exitSignal++;
                    this.get('userStore').rawRequest({
                        url: putUrl,
                        method: 'PUT',
                    }).then(() => {
                        mailSentCount++;
                        if(mailSentCount+mailNotSentCount===totalInvitee){
                            if(mailSentCount===totalInvitee){
                            //this.get('growl').message(this.get('intl').t('invite.confirm.message.success',{inviteeCount:totalInvitee}));
                                $.notify({
                                    message: this.get('intl').t('invite.confirm.message.success',{inviteeCount:totalInvitee}) 
                                },{
                                    type: 'success'
                                });
                            }
                            else{
                                let invited=totalInvitee-mailNotSentCount;
                                //this.get('growl').message(this.get('intl').t('invite.confirm.message.partialSuccess',{inviteeCount:invited, totalInviteeCount:totalInvitee}));
                                $.notify({
                                    message: this.get('intl').t('invite.confirm.message.partialSuccess',{inviteeCount:invited, totalInviteeCount:totalInvitee}) 
                                },{
                                    type: 'warning'
                                });
                            }
                        }

                    }).catch(() => {
                        mailNotSentCount++;
                        if(mailSentCount+mailNotSentCount===totalInvitee){
                            if(mailNotSentCount===totalInvitee){
                                $.notify({
                                    message: this.get('intl').t('invite.confirm.message.failure') 
                                },{
                                    type: 'danger'
                                });
                            }
                            else{
                                let invited=totalInvitee-mailNotSentCount;
                                $.notify({
                                    message: this.get('intl').t('invite.confirm.message.partialSuccess',{inviteeCount:invited, totalInviteeCount:totalInvitee}) 
                                },{
                                    type: 'success'
                                });
                            }
                        }
                    });
                }
                if (exitSignal === textField.length) {
                    //Success
                    //Teardown or tag objects
                    exitSignal = 0;
                    let tagLength = textField.length;
                    for (let index = 0; index < tagLength; index++) {
                        this.get('tags').removeAt(0);
                    }
                    this.set('tags', []);
                    this.send('cancel');
                } else {
                    //failure
                }
            }
        },
        addTag(tag) {
            let user_email = tag;
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (user_email.match(mailformat)) {
                this.get('tags').pushObject(tag);
                $('#notify').html('');
            } else {
                $('#notify').html(error[1]);
            }
        },
        removeTagAtIndex(index) {
            this.get('tags').removeAt(index);
            $('#notify').html('');
        },
        close: function () {
            this.send('cancel');
        }
    },
});