import Ember from 'ember';

export default Ember.Controller.extend({
    userStore: Ember.inject.service(),
    session: Ember.inject.service(),
    showDefaultSlackCardAddButton: true,
    defaultSlackCardId: null,
    init(){
        this._super(...arguments);
        let slackintegration = this.get('userStore').find('slackintegration');
        slackintegration = slackintegration._result.content;
        let showDefaultSlackCardAddButton = true;
        let defaultSlackCardId = null;
        if(slackintegration){
            slackintegration.forEach(function(item){
                if(item.kind === 'default'){
                    defaultSlackCardId = item.id;
                    showDefaultSlackCardAddButton = false;
                }
            });
            this.set('showDefaultSlackCardAddButton',showDefaultSlackCardAddButton);
            this.set('defaultSlackCardId',defaultSlackCardId);
        }
    },
    actions:{
        editDefaultSlackCard(){
            this.transitionToRoute('mayasecure.defaultmulebot',this.get('defaultSlackCardId'));
        },
    },
});
