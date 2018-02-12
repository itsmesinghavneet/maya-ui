import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('edit-slack-cluster', 'Integration | Component | edit slack cluster', {
    integration: true
});

test('it renders', function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{edit-slack-cluster}}`);

    assert.equal(this.$().text().trim(),this.$().text().trim());

    // Template block usage:
    this.render(hbs`
    {{#edit-slack-cluster}}
      template block text
    {{/edit-slack-cluster}}
  `);

    //  assert.equal(this.$().text().trim(), 'template block text');
});
