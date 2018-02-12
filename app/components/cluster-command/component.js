import Ember from 'ember';

export default Ember.Component.extend({
    command:null,
    init(){
        this._super(...arguments);
        if(this.get('commandType')==='importCommand'){
            this.set('command',this.get('importCommand'));
        }else if(this.get('commandType')==='installCommand'){
            this.set('command',this.get('installCommand'));
        }else if(this.get('commandType')==='importOCCommand'){
            this.set('command',this.get('importOCCommand'));
        }else if(this.get('commandType')==='installOCCommand'){
            this.set('command',this.get('installOCCommand'));
        }
    },
    didUpdateAttrs() {
        this._super(...arguments);
        if(this.get('commandType')==='importCommand'){
            this.set('command',this.get('importCommand'));
        }else if(this.get('commandType')==='installCommand'){
            this.set('command',this.get('installCommand'));
        }else if(this.get('commandType')==='importOCCommand'){
            this.set('command',this.get('importOCCommand'));
        }else if(this.get('commandType')==='installOCCommand'){
            this.set('command',this.get('installOCCommand'));
        }
    }
});
