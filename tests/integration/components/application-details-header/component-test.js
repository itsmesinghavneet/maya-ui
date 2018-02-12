import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('application-details-header', 'Integration | Component | application details header', {
    integration: true
});

test('it renders', function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('noOfPods',2);
    this.set('noOfVol',5);
    var person = {name:'This is model name'};
    this.set('model',person);

    this.render(hbs`{{application-details-header model=model}}`);

    assert.equal(this.$('h4').text().trim(), 'This is model name');

    // Template block usage:
    this.render(hbs`
    {{#application-details-header}}
      template block text
    {{/application-details-header}}
  `);

    //  assert.equal(this.$().text().trim(), 'template block text');
});
