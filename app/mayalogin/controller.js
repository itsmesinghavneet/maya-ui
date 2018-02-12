import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    init(){
        var refUrl=window.location.href;
        //Extract the invitecode from refUrl
        var trimmedInvitecode=refUrl.split('invitecode=')[1];
        this.get('session').set('invitecode',trimmedInvitecode);
		
    }
});