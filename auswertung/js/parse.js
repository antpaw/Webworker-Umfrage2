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
		var valueTotal = 0;
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
	    this.options.canvas(holder, 250, 250)
				.pieChart(125, 125, 100, valueArray);
		
	    for (var i = 0, ii = valueArray.length; i < ii; i++) {
	        valueTotal += valueArray[i];
	    }
		
		var ul = new Element('ul', {'class': 'results'});
		labelArray.each(function(label, i){
			new Element('li', {
				html: '<span class="label">' + label + '</span>'+
					' <em class="count percent">' + parseInt(valueArray[i] / (valueTotal /100)) + '%</em>' +
					' <em class="count number">' + valueArray[i] + '</em>'
			}).inject(ul);
		});
		new Element('li', {
			'class': 'total',
			html: '<span class="label">Insgesamt</span>'+
				' <em class="count percent">100%</em>' +
				' <em class="count number">' + valueTotal + '</em>'
		}).inject(ul);
		
		new Element('h3', {text: nodeData.headline}).inject(holder, 'top');
		ul.inject(holder);
		
		holder.inject(this.options.stage);
	},
	
	createPieChart: function(){
		
	}
});