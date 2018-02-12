import Ember from 'ember';

export function titleCase(params) {
    var str=(params[0]||'').trim();
    str = str.split(/\s/);
    var result = [];
    for (var i = 0; i<str.length; i++){
        var c = str[i].toLowerCase();
        var match = c.match(/./);
        var replace = match[0].toUpperCase();

        if (!c.match(/for\b|and\b|in\b/)){
            result.push(c.replace(match, replace));
        } else {
            result.push(c);
        }
    }
    str= result.join(' ');
    return str;
}
export default Ember.Helper.helper(titleCase);
 