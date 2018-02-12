import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('maya-clusters', 'Integration | Component | maya clusters', {
    integration: true
});

test('it renders', function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{maya-clusters}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs`
    {{#maya-clusters}}
      template block text
    {{/maya-clusters}}
  `);

    assert.equal(this.$().text().trim(), 'template block text');
});
