import Ember from 'ember';

export function forl(params) {
    //alert(params);
    var range = [];
    for(var i=0; i < params[0]; i++){
        range.push(i);
    }
    return range;
}

export default Ember.Helper.helper(forl);
