var visualizeForm = new Class({
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
		
		for (var property in this.defaults){
			this.createNode(property, this.defaults[property]);
		};
	},
	
	createNode: function(name, nodeData){
		var valueTotal = 0;
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
		
		if (nodeData.view === 'piechart_multiple') {
			this.results.each(function(vote){
				for (i = 0; i < ii; i++) {
					if (vote[opts[i].name] !== undefined) {
						opts[i].value++;
					}
				}
			});
		}
		else {
			this.results.each(function(vote){
				for (i = 0; i < ii; i++) {
					if (opts[i].name == vote[name]) {
						opts[i].value++;
					}
				}
			});
		}
		
		for (i = 0; i < opts.length; i++) {
			valueArray.push(opts[i].value);
			labelArray.push(opts[i].label);
		}
		
		var holder = this.options.cartHolder.clone().addClass(nodeData.view).set('id', name);
		
		if (nodeData.view === 'ger_map') {
			var R = this.options.canvas(holder, 400, 400);
			var ger = {
				sl: R.path(getMapPaths.sl),
				th: R.path(getMapPaths.th),
				nw: R.path(getMapPaths.nw),
				st: R.path(getMapPaths.st),
				sw: R.path(getMapPaths.sw),
				sn: R.path(getMapPaths.sn),
				mv: R.path(getMapPaths.mv),
				by: R.path(getMapPaths.by),
				bw: R.path(getMapPaths.bw),
				bb: R.path(getMapPaths.bb),
				rp: R.path(getMapPaths.rp),
				ni: R.path(getMapPaths.ni),
				be: R.path(getMapPaths.be),
				hh: R.path(getMapPaths.hh),
				hb: R.path(getMapPaths.hb),
				he: R.path(getMapPaths.he)
			};

			for (var state in ger) {
				ger[state][0].onmouseover = function(){
					console.log(state.replace('_chart_', '_label_'));
					//.addClass('hover');
				};
				ger[state][0].onmouseout = function(){
					//.removeClass('hover');
				};
			}
		}
		else {
			this.options.canvas(holder, 250, 250)
				.pieChart(125, 125, 100, valueArray, name);
		}
		
		
	    for (var i = 0, ii = valueArray.length; i < ii; i++) {
	        valueTotal += valueArray[i];
	    }
		
		var ul = new Element('ul', {'class': 'results'});
		labelArray.each(function(label, i){
			new Element('li', {
				id: name+'_label_'+i,
				html: '<span class="label">' + label + '</span>'+
					' <em class="count percent">' + parseInt(valueArray[i] / (valueTotal /100)) + '%</em>' +
					' <em class="count number">' + valueArray[i] + '</em>'
			}).inject(ul)
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