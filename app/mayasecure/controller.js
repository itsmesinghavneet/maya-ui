import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Controller.extend({
    application: Ember.inject.controller(),
    settings: Ember.inject.service(),
    prefs: Ember.inject.service(),
    projects: Ember.inject.service(),
    currentPath: Ember.computed.alias('application.currentPath'),
    error: null,
    userType: null,
    verifiedEmail: null,
    accountEmail: null,
    userProfile: null,
    isPopup: Ember.computed.alias('application.isPopup'),
    init() {
        this._super(...arguments);
        let accountArr = this.get('session').get(C.SESSION.ACCOUNT_ID).split('a'); //Account Id is 1a9 but we need only numeric value.
        let accountId = accountArr[1];
        this.get('userStore').find('accounts', null, {
            url: 'accounts',
            filter: {
                id: accountId
            },
            forceReload: true
        }).then((res) => {
            if (res) {
                this.set('userProfile', res.content[0]);
                this.set('userType', res.content[0].kind);
                this.set('verifiedEmail', res.content[0].verifiedEmail);
                this.set('accountEmail', res.content[0].accountEmail);
            }
        });
    },
    bootstrap: function () {
        Ember.run.schedule('afterRender', this, () => {
            this.get('application').setProperties({
                error: null,
                error_description: null,
                state: null,
            });

            let bg = this.get(`prefs.${C.PREFS.BODY_BACKGROUND}`);
            if (bg) {
                $('BODY').css('background', bg);
            }
        });
    }.on('init'),

    hasCattleSystem: function () {
        var out = false;
        (this.get('model.stacks') || []).forEach((stack) => {
            var info = stack.get('externalIdInfo');
            if (info && C.EXTERNAL_ID.SYSTEM_KINDS.indexOf(info.kind) >= 0) {
                out = true;
            }
        });

        return out;
    }.property('model.stacks.@each.externalId'),

    hasHosts: function () {
        return (this.get('model.hosts.length') > 0);
    }.property('model.hosts.length'),

    isReady: function () {
        return this.get('projects.isReady') && this.get('hasHosts');
    }.property('projects.isReady', 'hasHosts'),
});