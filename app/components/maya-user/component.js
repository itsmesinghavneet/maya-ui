import Ember from 'ember';
import C from 'ui/utils/constants';
export default Ember.Component.extend({
    session: Ember.inject.service(),
    currentUserid: null,
    filteredPeople: Ember.computed.filter('model', function (model) {
        var searchFilter = this.get('searchFilter');
        var regex = new RegExp(searchFilter, 'i');
        let str = model.name;
        let strPat = JSON.stringify(str);
        return strPat.match(regex);
    }).property('model', 'searchFilter'),
    searchFilter: '',
    sortedModel: Ember.computed.sort('filteredPeople', 'sortDefinition'),
    sortBy: 'name',
    reverseSort: false,
    toggle: [true, true, true, true],
    sortDefinition: Ember.computed('sortBy', 'reverseSort', function () {
        let sortOrder = this.get('reverseSort') ? 'desc' : 'asc';
        return [`${this.get('sortBy')}:${sortOrder}`];
    }),
    init() {
        this._super(...arguments);
        let currentUser = (this.get('session').get(C.SESSION.ACCOUNT_ID));
        this.set('currentUserid', currentUser);
    },
    actions: {
        userAccess(param) {
            if ((this.get('session').get(C.SESSION.ACCOUNT_ID) === param.id)) {
                $('#error').modal('show');
            } else {
                let newAccountModel = param.clone();
                if (newAccountModel.email === null) {
                    newAccountModel.email = '';
                }
                if (newAccountModel.kind === 'admin') {
                    newAccountModel.kind = 'user';
                } else {
                    newAccountModel.kind = 'admin';
                }
                newAccountModel.save().then(() => {}).catch(() => {

                });
            }
        },
        userAccessGrant(param) {
            if ((this.get('session').get(C.SESSION.ACCOUNT_ID) === param.id)) {
                $('#error').modal('show');
            } else {
                let newAccountModel = param.clone();
                if (newAccountModel.email === null) {
                    newAccountModel.email = '';
                }
                if (newAccountModel.accessGrant === false) {
                    newAccountModel.accessGrant = true;
                } else {
                    newAccountModel.accessGrant = false;
                }
                newAccountModel.save().then((/*xhr*/) => {}).catch((/*res*/) => {

                });
            }
        },
        sortParam(param, caller) {
            //If there is a tie in sorting for a particular parameter
            //then it will be sorted by using the default parameter which is name by the algorithm.
            if (this.get('toggle')[caller] === false) {
                this.set('reverseSort', this.get('toggle')[caller]);
                this.set('sortBy', param);
                this.get('toggle')[caller] = true;
            } else {
                this.set('reverseSort', this.get('toggle')[caller]);
                this.set('sortBy', param);
                this.get('toggle')[caller] = false;
            }
        },
        handleFilterEntry() {
            let str = this.get('value');
            this.set('searchFilter', str);
        },
    }
});