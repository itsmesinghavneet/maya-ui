import Ember from 'ember';
import Cookies from 'ember-cli-js-cookie';
//import C from 'ui/utils/constants';
export default Ember.Service.extend({
    cookies: Ember.inject.service(),
    session: Ember.inject.service(),
    userStore: Ember.inject.service('user-store'),
    orgName: null,
    orgId: null,
    mayaUrl: null,
    getorgName(){
        return this.get('orgName');
    },
    getorgId(){
        return this.get('orgId');
    },
    setorgName(name){
        this.set('orgName',name);
    },
    setorgId(id){
        this.set('orgId',id);
    },
    checkOrg(){
        this.get('userStore').rawRequest({
            url: 'organizations',
            method: 'GET',
      
        }).then((xhr) => {
            if(xhr.body.data !==''){
            }else{
                this.get('organization').createOrg((this.get('mayafancyname').orgFancyName));
            }
      
        }).catch((res) => {
            let err;
            try {
                err = res.body;
            } catch(e) {
                err = {type: 'error', message: 'Error logging in'};
            }
            return Ember.RSVP.reject(err);
        });

    },
    init(){
        this._super(...arguments);
        this.get('userStore').rawRequest({
            url: 'organizations',
            method: 'GET',
      
        }).then((xhr) => {
            Cookies.set('currentOrgId',xhr.body.data[0].id);
            Cookies.set('currentOrgName',xhr.body.data[0].name);
            this.get('session').set('currentOrgId',xhr.body.data[0].id);
            this.get('session').set('currentOrgState',xhr.body.data[0].state);
            this.setorgName(xhr.body.data[0].name);
            this.setorgId(xhr.body.data[0].id);
      
        }).catch((res) => {
            let err;
            try {
                err = res.body;
            } catch(e) {
                err = {type: 'error', message: 'Error logging in'};
            }
            return Ember.RSVP.reject(err);
        });

    },
    createOrg(name) {
        return this.get('userStore').rawRequest({
            url: 'organizations',
            method: 'POST',
            data: {
                name: name,
                description: '',
                mayaUrl: window.location.origin,
            },
        }).then((/*xhr*/) => {
        }).catch((res) => {
            let err;
            try {
                err = res.body;
            } catch(e) {
                err = {type: 'error', message: 'Error logging in'};
            }
            return Ember.RSVP.reject(err);
        });
    },
});
  