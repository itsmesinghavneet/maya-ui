import Ember from 'ember';

export default Ember.Component.extend({
    activeClusterCount : null,
    inactiveClusterCount : null,
    filteredCluster: Ember.computed.filter('model', function (model) {
        var searchFilter = this.get('searchFilter');
        var regex = new RegExp(searchFilter, 'i');
        let str = model.name;
        let strPat = JSON.stringify(str);
        return strPat.match(regex);
    }).property('model', 'searchFilter'),
    searchFilter: '',
    sortedModel: Ember.computed.sort('filteredCluster', 'sortDefinition'),
    sortBy: 'name',
    reverseSort: false,
    toggle: true,
    sortclass : 'fa fa-sort-alpha-asc',
    sortDefinition: Ember.computed('sortBy', 'reverseSort', function () {
        let sortOrder = this.get('reverseSort') ? 'desc' : 'asc';
        return [`${this.get('sortBy')}:${sortOrder}`];
    }),
    init() {
        this._super(...arguments);
        let activeClusterCount = 0;
        let inactiveClusterCount = 0;
        if(this.get('model')){
            this.get('model').forEach(function(item){
                if(item.state ==='active'){
                    activeClusterCount += 1;
                }else if(item.state ==='inactive'){
                    inactiveClusterCount += 1;
                }
            });
        }
        this.set('activeClusterCount', activeClusterCount);
        this.set('inactiveClusterCount', inactiveClusterCount);
    },
    didRender(){
        this._super(...arguments);
        let activeClusterCount = 0;
        let inactiveClusterCount = 0;
        if(this.get('model')){
            this.get('model').forEach(function(item){
                if(item.state ==='active'){
                    activeClusterCount += 1;
                }else if(item.state ==='inactive'){
                    inactiveClusterCount += 1;
                }
            });
        }
        this.set('activeClusterCount', activeClusterCount);
        this.set('inactiveClusterCount', inactiveClusterCount);
    },
    actions:{
        importCluster(){
            this.sendAction('importCluster');
        },
        switchProject(id){
            this.sendAction('switchProject',id);
        },
        sortParam() {
            if (this.get('toggle') === false) {
                this.set('reverseSort', this.get('toggle'));
                this.set('toggle',true);
                this.set('sortclass','fa fa-sort-alpha-asc');
            } else {
                this.set('reverseSort', this.get('toggle'));
                this.set('toggle',false);
                this.set('sortclass','fa fa-sort-alpha-desc');
            }
        },
        handleFilterEntry() {
            let str = this.get('value');
            this.set('searchFilter', str);
        }
    }
});
