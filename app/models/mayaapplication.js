import Ember from 'ember';
import Resource from 'ember-api-store/models/resource';
import PolledResource from 'ui/mixins/cattle-polled-resource';
var Mayaapplication = Resource.extend(PolledResource, {
    userStore: Ember.inject.service('user-store'),
    type: 'mayaapplication',
  
});
Mayaapplication.reopenClass({
    pollTransitioningDelay: 1000,
    pollTransitioningInterval: 5000,
});

export default Mayaapplication;