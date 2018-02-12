import Ember from 'ember';

export default Ember.Mixin.create({
    toCb(name_or_fn, ...args) {
        return (results, cb) => {
            if ( typeof results === 'function' ) {
                cb = results;
                //console.log("Inside toCb function",cb);
                results = null;
            }

            let promise;
            if ( typeof name_or_fn === 'string' ) {
                promise = this[name_or_fn](...args, results);
            } else {
                promise = name_or_fn(...args, results);
            }

            promise.then(function(res) {
                console.log('cb',res);
                cb(null, res);
            }).catch(function(err) {
                cb(err, null);
            });
        };
    }
});

