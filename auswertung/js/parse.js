var createPies = new Class({
	Implements: [Options, Events],
	
	options: {
		stage: null,
		cartHolder: new Element('div', {'class': 'node'})
	},
	version: '0.1',
	results: null,
	
	initialize: function(defaults, results, opts){
		if (!$defined(results)) return;
		if (!$defined(defaults)) return;
		
		this.setOptions(opts);
		
		this.results = results;
		this.defaults = defaults;
		
		
		for (property in this.defaults){
			this.createNode(property, this.defaults[property]);
		};
	},
	
	createNode: function(name, nodeData){
		var valueArray = [];
		var labelArray = [];
		var opts = nodeData.options;
		
		this.results.each(function(vote){
			if (opts[vote[name]].value === undefined){
				opts[vote[name]].value = 0;
			}
			
			opts[vote[name]].value++;
		});
		
		for (v in opts){
			valueArray.push(opts[v].value);
			labelArray.push(opts[v].label);
		}
		
		var holder = this.options.cartHolder.clone();
	    this.options.canvas(holder, 400, 400)
				.pieChart(200, 200, 100, valueArray, labelArray, "#fff");
		
		holder.inject(this.options.stage);
	},
	
	createPieChart: function(){
		
	}
});