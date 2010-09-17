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
		    // Grab the data
		    var labels = labelArray,
		        data = valueArray;

		    // Draw
		    var width = 800,
		        height = 250,
		        leftgutter = 30,
		        bottomgutter = 20,
		        topgutter = 20,
		        colorhue = .6 || Math.random(),
		        color = "hsb(" + [colorhue, .5, 1] + ")",
		        r = this.options.canvas(holder, width, height),
		        txt = {font: '12px Helvetica, Arial', fill: "#fff"},
		        txt1 = {font: '10px Helvetica, Arial', fill: "#fff"},
		        txt2 = {font: '12px Helvetica, Arial', fill: "#000"},
		        X = (width - leftgutter) / labels.length,
		        max = Math.max.apply(Math, data),
		        Y = (height - bottomgutter - topgutter) / max;
		    r.drawGrid(leftgutter + X * .5 + .5, topgutter + .5, width - leftgutter - X, height - topgutter - bottomgutter, 10, 10, "#333");
		    var path = r.path().attr({stroke: color, "stroke-width": 4, "stroke-linejoin": "round"}),
		        bgp = r.path().attr({stroke: "none", opacity: .3, fill: color}),
		        label = r.set(),
		        is_label_visible = false,
		        leave_timer,
		        blanket = r.set();
		    label.push(r.text(60, 12, "24 hits").attr(txt));
		    label.push(r.text(60, 27, "22 September 2008").attr(txt1).attr({fill: color}));
		    label.hide();
		    var frame = r.popup(100, 100, label, "right").attr({fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": .7}).hide();
		    var p, bgpp;
		    for (var i = 0, ii = labels.length; i < ii; i++) {
		        var y = Math.round(height - bottomgutter - Y * data[i]),
		            x = Math.round(leftgutter + X * (i + .5)),
		            t = r.text(x, height - 6, labels[i]).attr(txt).toBack();
		        if (!i) {
		            p = ["M", x, y, "C", x, y];
		            bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
		        }
		        if (i && i < ii - 1) {
		            var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
		                X0 = Math.round(leftgutter + X * (i - .5)),
		                Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
		                X2 = Math.round(leftgutter + X * (i + 1.5));
		            var a = getAnchors(X0, Y0, x, y, X2, Y2);
		            p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
		            bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
		        }
		        var dot = r.circle(x, y, 4).attr({fill: "#000", stroke: color, "stroke-width": 2});
		        blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));
		        var rect = blanket[blanket.length - 1];
		        (function (x, y, data, lbl, dot) {
		            var timer, i = 0;
		            rect.hover(function () {
		                clearTimeout(leave_timer);
		                var side = "right";
		                if (x + frame.getBBox().width > width) {
		                    side = "left";
		                }
		                var ppp = r.popup(x, y, label, side, 1);
		                frame.show().stop().animate({path: ppp.path}, 200 * is_label_visible);
		                label[0].attr({text: data + " hit" + (data == 1 ? "" : "s")}).show().stop().animateWith(frame, {translation: [ppp.dx, ppp.dy]}, 200 * is_label_visible);
		                label[1].attr({text: lbl + " September 2008"}).show().stop().animateWith(frame, {translation: [ppp.dx, ppp.dy]}, 200 * is_label_visible);
		                dot.attr("r", 6);
		                is_label_visible = true;
		            }, function () {
		                dot.attr("r", 4);
		                leave_timer = setTimeout(function () {
		                    frame.hide();
		                    label[0].hide();
		                    label[1].hide();
		                    is_label_visible = false;
		                }, 1);
		            });
		        })(x, y, data[i], labels[i], dot);
		    }
		    p = p.concat([x, y, x, y]);
		    bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
		    path.attr({path: p});
		    bgp.attr({path: bgpp});
		    frame.toFront();
		    label[0].toFront();
		    label[1].toFront();
		    blanket.toFront();
		
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
					document.getElementById(elem.id.replace('_label_', '_chart_')).setAttribute('class', 'hover');
				},
				mouseleave: function(e){
					var elem = e.target;
					if (elem.id === ''){
						elem = elem.getParent('li');
					}
					document.getElementById(elem.id.replace('_label_', '_chart_')).removeAttribute('class');
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