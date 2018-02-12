import Ember from 'ember';
import C from 'ui/utils/constants';
const DEFAULT_ROUTE = 'mayaapplications';
const VALID_ROUTES = [DEFAULT_ROUTE];
export default Ember.Route.extend({
    redirect() {
        let route = this.get(`session.${C.SESSION.CONTAINER_ROUTE}`);
        if ( !VALID_ROUTES.includes(route) ) {
            route = DEFAULT_ROUTE;
        }
        this.replaceWith(route);
    },
});