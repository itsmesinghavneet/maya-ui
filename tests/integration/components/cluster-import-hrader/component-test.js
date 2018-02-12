import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cluster-import-hrader', 'Integration | Component | cluster import hrader', {
    integration: true
});

test('it renders', function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{cluster-import-hrader}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs`
    {{#cluster-import-hrader}}
      template block text
    {{/cluster-import-hrader}}
  `);

    assert.equal(this.$().text().trim(), 'template block text');
});
