import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('defaultslack-cluster', 'Integration | Component | defaultslack cluster', {
    integration: true
});

test('it renders', function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{defaultslack-cluster}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs`
    {{#defaultslack-cluster}}
      template block text
    {{/defaultslack-cluster}}
  `);

    assert.equal(this.$().text().trim(), 'template block text');
});
