var visualizeForm = new Class({
	Implements: [Options, Events],
	
	options: {
		stage: null,
		chartHolder: new Element('div', {'class': 'node'}),
		nodesTmpl: new Element('div', {'class': 'nodes'})
	},
	version: '0.1',
	results: null,
	resultsLength: 0,
	nodes: null,
	filter: {},
	
	initialize: function(defaults, results, opts){
		if (!$defined(results)) { return; }
		if (!$defined(defaults)) { return; }
		
		this.setOptions(opts);
		
		this.results = results;
		this.resultsLength = results.length;
		this.defaults = defaults;
		
		this.createNodes();
	},
	
	createNodes: function(){
		this.nodes = this.options.nodesTmpl.clone();
		for (var property in this.defaults){
			this.defaults[property].name = property;
			this.createOneNode(this.defaults[property]).inject(this.nodes);
		}
		
		this.nodes.inject(this.options.stage);
		var a = this.nodes;
		var f = this.filter;
		setTimeout(function(){
			a.addClass('add');
			
			for (var nodeName in f) {
				var filter = f[nodeName];
				for (var i = 0; i < filter.values.length; i++) {
					var chart = $(nodeName+'_chart_'+filter.values[i]);
					if (chart) {
						chart.addSvgClass('filter');
					}
					$(nodeName+'_label_'+filter.values[i]).addClass('filter');
				}
			}
		}, 700);
		
	},
	
	createOneNode: function(nodeData){
		var result = this.countResults(nodeData);
		
		var holder = this.options.chartHolder.clone().addClass(nodeData.view).set('id', nodeData.name);
		
		this.createChart(holder, result.values, result.labels, nodeData);
		this.createList(holder, result.values, result.labels, nodeData);
		
		return holder;
	},
	
	countResults: function(nodeData){
		var values = [];
		var labels = [];
		var opts = nodeData.options;
		var i;
		var ii = opts.length;
		
		for (i = 0; i < ii; i++) {
			opts[i].value = 0;
		}
		
		var hasFilter = ! new Hash(this.filter).isEmpty();
		
		for (var j = 0; j < this.resultsLength; j++){
			var result = this.results[j];
			for (i = 0; i < ii; i++) {
				var multiple = (nodeData.view === 'piechart_multiple');
				if (multiple && result[opts[i].name] === undefined) { continue; }
				if ( ! multiple && result[nodeData.name] !== opts[i].name) { continue; }
				
				if ( ! hasFilter || hasFilter && this.filterApplies(result)) {
					opts[i].value++;
				}
			}
		}
		
		for (i = 0; i < ii; i++) {
			values.push(opts[i].value);
			labels.push(opts[i].label);
		}
		
		return {
			'values': values,
			'labels': labels
		};
	},
	
	filterApplies: function(result){
		var multiple,
			nodeName,
			filter,
			multipleFilter = [],
			i;
		
		for (nodeName in this.filter) {
			filter = this.filter[nodeName];
			if (this.defaults[nodeName].view === 'piechart_multiple'){
				for (i = 0; i < filter.values.length; i++) {
					multipleFilter.push(filter.values[i]);
				}
			}
		}
		
		function hasMultipleValues(arr){
			for (i = 0; i < multipleFilter.length; i++){
				if (arr[multipleFilter[i]] === undefined) {
					return false;
				}
			}
			
			return true;
		}
		
		for (nodeName in this.filter) {
			filter = this.filter[nodeName];
			multiple = (this.defaults[nodeName].view === 'piechart_multiple');
			for (i = 0; i < filter.values.length; i++){
				if (multiple && result[filter.values[i]] === undefined) {
					return false;
				}
				if ( ! multiple && (result[nodeName] !== filter.values[i] || !hasMultipleValues(result))) {
					return false;
				}
				
			}
		}
		return true;
	},
	
	filterClick: function(e){
		var params = e.target.id.split('_');
		
		this.updateFilter(params[0], params[2]);
		
		this.removeNodes();
		this.createNodes();
		
		this.fireEvent('changedFilter');
	},
	
	removeNodes: function(){
		var nodes = this.nodes;
		nodes.addClass('remove');
		setTimeout(function(){
			nodes.destroy();
		}, 600);
	},
	
	updateFilter: function(name, value){
		if (this.filter[name] === undefined || this.filter[name].values === undefined) {
			this.filter[name] = {
				values: [value]
			};
		}
		else {
			if (this.filter[name].values.contains(value)) {
				this.filter[name].values.erase(value);
				
				if ( ! this.filter[name].values.length) {
					delete this.filter[name];
				}
			}
			else {
				if (this.defaults[name].view === 'piechart_multiple') {
					this.filter[name].values.include(value);
				}
				else {
					this.filter[name] = {
						values: [value]
					};
				}
			}
		}
	},
	
	createChart: function(holder, values, labels, nodeData){
		var i, ii;
		var opts = nodeData.options;
		
		if (nodeData.view === 'piechart_map') {
			var R = this.options.canvas(holder, 450, 700);
			
			ii = nodeData.options.length;
			for (i = 0; i < ii; i++) {
				if (mapPaths[opts[i].name] === undefined) {
					continue;
				}
				$(R.path(mapPaths[opts[i].name]).scale(1.5, 1.5, 0, 0)[0])
					.set('id', nodeData.name+'_chart_'+opts[i].name)
					.addEvents({
						mouseover: function(e){
							$(e.target.id.replace('_chart_', '_label_')).addClass('hover');
						},
						mouseout: function(e){
							$(e.target.id.replace('_chart_', '_label_')).removeClass('hover');
						},
						click: this.filterClick.bind(this)
					});
			}
		}
		else if (nodeData.view === 'linechart') {
			var width = 780,
				height = 250;
			
			for (i = 0; i < labels.length; i++) {
				var euro = parseInt(labels[i].split('–')[0].replace(/[^0-9\.]+/, ''), 10);
				labels[i] = euro? euro+' €' : 'kA';
			}
			
			var points = this.options.canvas(holder, width, height)
					.lineChart(width, height, values, labels);
					
			for (i = 0; i < points.length; i++) {
				
				points[i].labelTextBottom.node.id = nodeData.name+'_text_'+opts[i].name;
				points[i].dot.node.id = nodeData.name+'_chart_'+opts[i].name;
				points[i].rect.node.id = nodeData.name+'_area_'+opts[i].name;
				
				$(points[i].rect.node)
					.addEvents({
						mouseover: function(e){
							$(e.target.id.replace('_area_', '_chart_')).addSvgClass('hover');
							$(e.target.id.replace('_area_', '_label_')).addClass('hover');
							$(e.target.id.replace('_area_', '_text_')).addSvgClass('hover');
						},
						mouseout: function(e){
							$(e.target.id.replace('_area_', '_chart_')).removeSvgClass('hover');
							$(e.target.id.replace('_area_', '_label_')).removeClass('hover');
							$(e.target.id.replace('_area_', '_text_')).removeSvgClass('hover');
						},
						click: this.filterClick.bind(this)
					});
			}
		}
		else {
			var canvasSize, pieSize, radius;
			
			canvasSize = 250;
			radius = 100;
			if (nodeData.small){
				canvasSize = 130;
				radius /= 2;
			}
			pieSize = canvasSize/2;
			
			var slices = this.options.canvas(holder, canvasSize, canvasSize)
						.pieChart(pieSize, pieSize, radius, values);
			
			for (i = 0; i < slices.length; i++) {
				var slice = slices[i];
				
				if ( ! slice) {
					continue;
				}
				
				slice.node.id = nodeData.name+'_chart_'+opts[i].name;

				slice
					.mouseover(function(){
						this.animate({scale: [1.1, 1.1, pieSize, pieSize]}, 500, 'backOut');
						$(this.node.id.replace('_chart_', '_label_')).addClass('hover');
					})
					.mouseout(function(){
						this.animate({scale: [1, 1, pieSize, pieSize]}, 500, 'backIn');
						$(this.node.id.replace('_chart_', '_label_')).removeClass('hover');
					});
					
				$(slice.node).addEvent('click', this.filterClick.bind(this));
			}
		}
	},
	
	createList: function(holder, values, labels, nodeData){
		var valueTotal = 0;
		var i;
		var ii = values.length;
		var thisClass = this;
		
		for (i = 0; i < ii; i++) {
			valueTotal += values[i];
		}
		
		var ul = new Element('ul', {'class': 'results'+(nodeData.small? ' small' : '')});
		
		function liHtml(label, percent, number) {
			return	' <span class="label">' + label + '</span>'+
					' <em class="count percent">' + percent + '%</em>'+
					' <em class="count number">' + number + '</em>';
		}
		
		for (i = 0; i < ii; i++) {
			new Element('li', {
				id: nodeData.name+'_label_'+nodeData.options[i].name,
				html: liHtml(labels[i], valueTotal? parseInt(values[i] / valueTotal * 100, 10) : 0, values[i])
			})
			.addEvents({
				mouseenter: function(e){
					var chart = $(this.id.replace('_label_', '_chart_'));
					if (chart){
						chart.addSvgClass('hover');
					}
				},
				mouseleave: function(e){
					var chart = $(this.id.replace('_label_', '_chart_'));
					if (chart){
						chart.removeSvgClass('hover');
					}
				},
				click: function(){
					thisClass.filterClick({target: this});
				}
			})
			.inject(ul);
		}
		
		new Element('li', {
			'class': 'total',
			html: liHtml('Insgesamt', 100, valueTotal)
		}).inject(ul);
		
		new Element('h3', {text: nodeData.headline}).inject(holder, 'top');
		
		holder.adopt(ul);
	}
});