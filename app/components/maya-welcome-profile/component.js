import Ember from 'ember';
import C from 'ui/utils/constants';
export default Ember.Component.extend({
    profileUrl : C.GITHUB.PROFILE_PIC,
    fullProfileUrl: Ember.computed(function() {
        return `${this.get('profileUrl')}${this.get('model').externalId}`;
    }),
});
