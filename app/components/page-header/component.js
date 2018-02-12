import Ember from 'ember';
import C from 'ui/utils/constants';
export default Ember.Component.extend({
    intl: Ember.inject.service(),
    modalService: Ember.inject.service('modal'),
    session:Ember.inject.service(),
    grafanaUrl:'',
    acccountEmailPopup: null,
    init(){
        this._super(...arguments);
        let organizations=this.get('model.organizations');
        let organization=organizations.findBy('id',this.get('session').get('currentOrgId'));
        this.set('grafanaUrl',organization.grafanaUrl);
    },

    actions: {
        acccountEmailPop() {
            this.send('resendEmail');
        },
        resendEmail() {
            let currentUserId = this.get('session').get(C.SESSION.ACCOUNT_ID);
            this.get('userStore').rawRequest({
                url: 'accounts/' + currentUserId + '?' + 'verificationEmailResend=true',
                method: 'PUT',
            }).then(( /*xhr*/ ) => {

            }).catch(( /*res*/ ) => {
                //let err;
                try {
                    //err = res.body;
                } catch (e) {
                    //err = {type: 'error', message: 'Some Exception Occured '};
                }
            });
        },
        inviteFriends(){
            this.get('modalService').toggleModal('modal-invite-friends',
                Ember.Object.create({
                    title:this.get('intl').t('invite.header.header1'),
                    subtitle:this.get('intl').t('invite.subHeader.subHeader1'),
                }));
        }
    }
});