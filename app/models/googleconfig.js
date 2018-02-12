import Resource from 'ember-api-store/models/resource';

var GoogleConfig = Resource.extend({
    type: 'googleConfig',
});

// Projects don't get pushed by /subscribe WS, so refresh more often
GoogleConfig.reopenClass({
    mangleIn: function(data, store) {
        if ( data.allowedIdentities )
        {
            // Labels shouldn't be a model even if it has a key called 'type'
            data.allowedIdentities = data.allowedIdentities.map((obj) => {
                obj.type = 'identity';
                return store.createRecord(obj);
            });
        }

        return data;
    },
});

export default GoogleConfig;