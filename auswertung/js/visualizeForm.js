var visualizeForm = new Class({
	Implements: [Options, Events],
	
	options: {
		stage: null,
		cartHolder: new Element('div', {'class': 'node'})
	},
	version: '0.1',
	results: null,
	resultsLength: 0,
	
	initialize: function(defaults, results, opts){
		if (!$defined(results)) return;
		if (!$defined(defaults)) return;
		
		this.setOptions(opts);
		
		this.results = results;
		this.resultsLength = results.length;
		this.defaults = defaults;
		
		for (var property in this.defaults){
			this.createNode(property, this.defaults[property]);
		}
	},
	
	createNode: function(name, nodeData){
		var valueArray = [];
		var labelArray = [];
		var opts = nodeData.options;
		var i;
		var ii = opts.length;
		
		for (i = 0; i < ii; i++) {
			if (opts[i].value === undefined) {
				opts[i].value = 0;
			}
		}
		
		var multiple = (nodeData.view === 'piechart_multiple');
		for (var j = 0; j < this.resultsLength; j++){
			for (i = 0; i < ii; i++) {
				if (multiple && this.results[j][opts[i].name] === undefined) continue;
				if ( ! multiple && opts[i].name !== this.results[j][name]) continue;
				
				opts[i].value++;
			}
		}
		
		for (i = 0; i < opts.length; i++) {
			valueArray.push(opts[i].value);
			labelArray.push(opts[i].label);
		}
		
		var holder = this.options.cartHolder.clone().addClass(nodeData.view).set('id', name);
		
		if (nodeData.view === 'piechart_map') {
			var R = this.options.canvas(holder, 400, 400);
			
			for (i = 0; i < ii; i++) {
				if (mapPaths[opts[i].name] === undefined) continue;
				
				$(R.path(mapPaths[opts[i].name])[0])
					.set('id', name+'_chart_'+i)
					.addEvents({
						mouseover: function(e){
							$(e.target.id.replace('_chart_', '_label_')).addClass('hover');
						},
						mouseout: function(e){
							$(e.target.id.replace('_chart_', '_label_')).removeClass('hover');
						}
					});
			}
		}
		else {
			this.options.canvas(holder, 250, 250)
				.pieChart(125, 125, 100, valueArray, name);
		}
		
		this.createList(holder, valueArray, labelArray, nodeData.headline, name)
			.inject(this.options.stage);
	},
	
	createList: function(holder, valueArray, labelArray, headline, name){
		var valueTotal = 0;
		var i;
		var ii = valueArray.length;
		
		for (i = 0; i < ii; i++) {
	        valueTotal += valueArray[i];
	    }
		
		var ul = new Element('ul', {'class': 'results'});
		
		for (i = 0; i < ii; i++) {
			new Element('li', {
				id: name+'_label_'+i,
				html: '<span class="label">' + labelArray[i] + '</span>'+
					'  <em class="count percent">' + parseInt(valueArray[i] / valueTotal * 100) + '%</em>'+
					'  <em class="count number">' + valueArray[i] + '</em>'
			}).inject(ul);
		}
		
		new Element('li', {
			'class': 'total',
			html: '<span class="label">Insgesamt</span>'+
				'  <em class="count percent">100%</em>'+
				'  <em class="count number">' + valueTotal + '</em>'
		}).inject(ul);
		
		new Element('h3', {text: headline}).inject(holder, 'top');
		
		return holder.adopt(ul);
	}
});