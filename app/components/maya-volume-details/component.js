import Ember from 'ember';

export default Ember.Component.extend({
    willDestroyElement() {
        this._super(...arguments);
    }
});
