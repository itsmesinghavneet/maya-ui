import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('chatops-loading', 'Integration | Component | chatops loading', {
    integration: true
});

test('it renders', function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{chatops-loading}}`);

    assert.equal(this.$().text().trim(),this.$().text().trim());

    // Template block usage:
    this.render(hbs`
    {{#chatops-loading}}
      template block text
    {{/chatops-loading}}
  `);

    //  assert.equal(this.$().text().trim(), 'template block text');
});
