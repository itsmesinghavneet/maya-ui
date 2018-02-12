import Ember from 'ember';

export default Ember.Component.extend({
    passwordshow: false,
    passwordbtnclass: 'fa-eye-slash',
    classname: 'password',
    monitoringUsername: null,
    monitoringPassword: null,
    monitoringPasswordStart: null,
    init() {
        this._super(...arguments);
        let apiKey = this.get('model').apiKey;
        let decodedApiKey = atob(apiKey);
        let username;
        let password;
        if (decodedApiKey) {
            decodedApiKey = decodedApiKey.split(':');
            username = decodedApiKey[0];
            password = decodedApiKey[1];
        }
        this.set('monitoringUsername', username);
        this.set('monitoringPassword', password);
        var starText='';
        for(var i=0;i<password.length;i++){
            starText=starText+'*';
        }
        this.set('monitoringPasswordStart',starText);
    },
    actions: {
        togglestate() {
            if (this.get('passwordshow')) {
                this.set('passwordbtnclass', 'fa-eye-slash');
                $('#password').text(this.get('monitoringPasswordStart'));
            } else {
                this.set('passwordbtnclass', 'fa-eye');
                $('#password').text(this.get('monitoringPassword'));
            }
            this.set('passwordshow', !this.get('passwordshow'));
        }
    }
});