import Ember from 'ember';

export default Ember.Component.extend({
    init() {
        this._super(...arguments);
        this.sendAction('startRefresh');
    },
    willDestroyElement() {
        this._super(...arguments);
        this.sendAction('stopRefresh');
    }
});
