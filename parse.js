var createPies = new Class({
	Implements: [Options, Events],
	
	options: {
		stage: null,
		cartHolder: new Element('div', {'class': 'chart_holder'})
	},
	version: '0.1',
	results: null,
	
	initialize: function(defaults, results, opts){
		if (!$defined(results)) return;
		if (!$defined(defaults)) return;
		
		this.setOptions(opts);
		
		this.results = results;
		this.defaults = defaults;
		
		
		this.defaults.each(function(property){
			this.createPie(property.filter, property.values, property.labels);
		}.bind(this));
	},
	
	createPie: function(filter, values, labels){
		var valueArray = [];
		
		this.results.each(function(vote){
			values[vote[filter]]++;
		});
		
		for (v in values){
			valueArray.push(values[v]);
		}
		
		var holder = this.options.cartHolder.clone();
	    Raphael(holder, 700, 700)
				.pieChart(350, 350, 200, valueArray, labels, "#fff");
		
		holder.inject(this.options.stage);
	}
});