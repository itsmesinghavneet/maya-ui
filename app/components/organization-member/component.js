import Ember from 'ember';

export default Ember.Component.extend({
    btnLabel:'',
    intl: Ember.inject.service(),
    init(){
        this._super(...arguments);
        this.set('btnLabel',this.get('intl').t('organization.btnLabel.expand'));
    },
    actions:{
        expand(){
            this.set('btnLabel','Collapse');
            if($('#expand-member').is(':visible')){

                this.set('btnLabel',this.get('intl').t('organization.btnLabel.expand'));
            }
            else{
                this.set('btnLabel',this.get('intl').t('organization.btnLabel.collapse'));
            }
            $('#expand-member').toggle(1000);
        }
    }
}); 
