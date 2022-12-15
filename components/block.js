polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  actions: {
    changeTab: function (index, tabName) {
      this.set(`details.hits.${index}.__activeTab`, tabName);
    }
  }
});
