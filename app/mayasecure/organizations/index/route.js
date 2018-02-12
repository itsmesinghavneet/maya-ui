import Ember from 'ember';

export default Ember.Route.extend({
	actions:{
		updateModelName(value,model,key){
			Ember.set(model,key,value);
		},
	}
});  
