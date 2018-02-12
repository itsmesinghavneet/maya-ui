import Ember from 'ember';

export default Ember.Service.extend({
    userStore: Ember.inject.service(),

    updatesettingformulebot(cid,csrt,rurl) {
        this.updatesettingsfield('slack.config.bot.client.id',cid);
        this.updatesettingsfield('slack.config.bot.client.secret',csrt);
        this.updatesettingsfield('slack.config.bot.redirect.url',rurl);
    },

    updatesettingsfield(url,value){
        this.get('userStore').rawRequest({
            url: 'setting/'+url,
            method: 'PUT',
            data: {
                name : url,
                value : value,
            },
        }).then((xhr) => {
            return xhr;
        }).catch((res) => {
            let err;
            try {
                err = res.body;
            } catch(e) {
                //
            }
            return Ember.RSVP.reject(err);
        });
    }
});
