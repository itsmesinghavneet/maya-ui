export function initialize() {
    if ( screen && (screen.width <= 570) ) {
        document.getElementById('viewport').setAttribute('content','width=1024');
    }
}

export default {
    name: 'viewport',
    initialize: initialize
};