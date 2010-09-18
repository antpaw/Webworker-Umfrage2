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
				if (
					(multiple && this.results[j][opts[i].name] !== undefined) ||
					( ! multiple && opts[i].name == this.results[j][name])
				){
					opts[i].value++;
				}
			}
		}
		
		for (i = 0; i < opts.length; i++) {
			valueArray.push(opts[i].value);
			labelArray.push(opts[i].label);
		}
		
		var holder = this.options.cartHolder.clone().addClass(nodeData.view).set('id', name);
		
		if (nodeData.view === 'piechart_map') {
			var R = this.options.canvas(holder, 450, 700);
			
			for (i = 0; i < ii; i++) {
				if (mapPaths[opts[i].name] === undefined) continue;
				
				$(R.path(mapPaths[opts[i].name]).scale(1.5, 1.5, 0, 0)[0])
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
		else if (nodeData.view === 'analytics') {
			 
			var width = 780,
				height = 250,
				vertCells = 5,
				horzCells = labelArray.length-1,
				leftgutter = 0,
				bottomgutter = 50,
				topgutter = 20,
				r = this.options.canvas(holder, width, height),
				X = (width - leftgutter) / labelArray.length,
				max = Math.max.apply(Math, valueArray),
				Y = (height - bottomgutter - topgutter) / max;

			r.drawGrid(
				leftgutter + X * .5,
				topgutter,
				width - leftgutter - X,
				height - topgutter - bottomgutter,
				horzCells, vertCells
			);
			
			var p,
				path = r.path(),
				blanket = r.set();
			
			path.node.setAttribute('class', 'line');
			
			for (i = 0, ii = labelArray.length; i < ii; i++) {
				var y = Math.round(height - bottomgutter - Y * valueArray[i]),
					x = Math.round(leftgutter + X * (i + .5)),
					labelTextLeft;
				if (i === 0) {
					p = ["M", x, y, "C", x, y];
				}
				if (i && i < ii - 1) {
					var Y0 = Math.round(height - bottomgutter - Y * valueArray[i - 1]),
						X0 = Math.round(leftgutter + X * (i - .5)),
						Y2 = Math.round(height - bottomgutter - Y * valueArray[i + 1]),
						X2 = Math.round(leftgutter + X * (i + 1.5));
					var a = getAnchors(X0, Y0, x, y, X2, Y2);
					p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
				}
				
				var euro = parseInt(labelArray[i].split('–')[0].replace(/[^0-9\.]+/, ''));
				labelTextBottom = r.text(x, height-20, (euro ? euro+' €' : 'kA'));
				labelTextBottom.node.setAttribute('class', 'text down');
				labelTextBottom.node.id = name+'_text_'+i;
				
				var dot = r.circle(x, y, 4);
				dot.node.setAttribute('class', 'dot');
				dot.node.id = name+'_chart_'+i;
				
				blanket.push(r.rect(leftgutter + X * i, 0, X, height).attr({fill: "#0000ff", opacity: 0}));
				var rect = blanket[blanket.length - 1];
				
				rect.node.id = name+'_area_'+i;
				
				$(rect.node)
					.addEvents({
						mouseover: function(e){
							$(e.target.id.replace('_area_', '_chart_')).setAttribute('class', 'dot hover');
							$(e.target.id.replace('_area_', '_label_')).addClass('hover');
							$(e.target.id.replace('_area_', '_text_')).setAttribute('class', 'text down hover');
						},
						mouseout: function(e){
							$(e.target.id.replace('_area_', '_chart_')).setAttribute('class', 'dot');
							$(e.target.id.replace('_area_', '_label_')).removeClass('hover');
							$(e.target.id.replace('_area_', '_text_')).setAttribute('class', 'text down');
						}
					});
				
			}
			
			var cellHeight = (height - bottomgutter -topgutter ) / vertCells;
			var girdValue = max / vertCells;
			
			var labelTextBottom;
			for (i = 0; i <= vertCells; i++) {
				labelTextBottom = r.text(leftgutter+25, height-bottomgutter-i*cellHeight+5, Math.ceil(girdValue *i));
				labelTextBottom.node.setAttribute('class', 'text left');
			}
			
			path.attr({path: p.concat([x, y, x, y])});
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
			})
			.addEvents({
				mouseenter: function(e){
					var elem = e.target;
					if (elem.id === ''){
						elem = elem.getParent('li');
					}
					var chart = document.getElementById(elem.id.replace('_label_', '_chart_'));
					if (chart){
						chart.setAttribute('class', chart.getAttribute('class')+' hover');
					}
				},
				mouseleave: function(e){
					var elem = e.target;
					if (elem.id === ''){
						elem = elem.getParent('li');
					}
					var chart = document.getElementById(elem.id.replace('_label_', '_chart_'));
					if (chart){
						chart.setAttribute('class', chart.getAttribute('class').replace(' hover', ''));
					}
				}
			})
			.inject(ul);
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