import Ember from 'ember';
import Resource from 'ember-api-store/models/resource';
import PolledResource from 'ui/mixins/cattle-polled-resource';
var slackintegration = Resource.extend(PolledResource, {
    userStore: Ember.inject.service('user-store'),
    type: 'slackintegration',
    actions:{
        create(){
        }
    },
    init() {
    },
});
slackintegration.reopenClass({
    pollTransitioningDelay: 1000,
    pollTransitioningInterval: 5000,
});

export default slackintegration;
   