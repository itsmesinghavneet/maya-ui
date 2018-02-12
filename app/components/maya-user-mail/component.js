import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';
export default Ember.Component.extend(NewOrEdit, {
    actions: {
        editAccount(val) {
            let user_email = this.get('userEmail');
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (user_email===undefined || user_email === '') {
                $('#notify').html('Please enter an email.');
                $('#welcome-email').focus();        }
            else if(user_email.match(mailformat)){
                val.set('email',this.get('userEmail'));
                val.save();
                //hide the modal on success
                $('#welcomedialog').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }
            else{
                $('#notify').html('Email is not valid');
            }
        },
    }
});
