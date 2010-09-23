Raphael.fn.pieChart = function (cx, cy, r, values) {
	var paper = this;
	var rad = Math.PI / 180;
	var chart = this.set();
	var angle = 0;
	var total = 0;
	var i, ii;
	
	function sector(cx, cy, r, startAngle, endAngle) {
		var x1 = cx + r * Math.cos(-startAngle * rad),
			x2 = cx + r * Math.cos(-endAngle * rad),
			y1 = cy + r * Math.sin(-startAngle * rad),
			y2 = cy + r * Math.sin(-endAngle * rad);
		return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]);
	}
	
	function createSlice(value){
		var angleplus = 360 * value / total,
			p;
		
		if (value === 0) {
			chart.push(false);
			return;
		}
		else if (total === value) {
			p = paper.circle(cx, cy, r);
		}
		else {
			p = sector(cx, cy, r, angle, angle + angleplus);
		}
		
		angle += angleplus;
		chart.push(p);
	}
	
	for (i = 0, ii = values.length; i < ii; i++) {
		total += values[i];
	}
	for (i = 0; i < ii; i++) {
		createSlice(values[i]);
	}
	
	return chart;
};


Raphael.fn.grid = function(x, y, w, h, wv, hv){
	var path = ["M", Math.round(x) + 0.5, Math.round(y) + 0.5, "L", Math.round(x + w) + 0.5, Math.round(y) + 0.5, Math.round(x + w) + 0.5, Math.round(y + h) + 0.5, Math.round(x) + 0.5, Math.round(y + h) + 0.5, Math.round(x) + 0.5, Math.round(y) + 0.5],
		rowHeight = h / hv,
		columnWidth = w / wv;
	for (var i = 1; i < hv; i++) {
		path = path.concat(["M", Math.round(x) + 0.5, Math.round(y + i * rowHeight) + 0.5, "H", Math.round(x + w) + 0.5]);
	}
	for (i = 1; i < wv; i++) {
		path = path.concat(["M", Math.round(x + i * columnWidth) + 0.5, Math.round(y) + 0.5, "V", Math.round(y + h) + 0.5]);
	}
	
	return this.path(path.join(",")).node.setAttribute('class', 'grid');
};

Raphael.fn.lineChart = function(width, height, values, labels){
	var vertCells = 5,
		horzCells = labels.length-1,
		leftgutter = 0,
		bottomgutter = 50,
		topgutter = 20,
		max = Math.max.apply(Math, values),
		X = (width - leftgutter) / labels.length,
		Y,
		collector = [];
	
	this.grid(
		leftgutter + X / 2,
		topgutter,
		width - leftgutter - X,
		height - topgutter - bottomgutter,
		horzCells, vertCells
	);
	
	if (max) {
		Y = (height - bottomgutter - topgutter) / max;
	}
	else {
		return collector;
	}
	
	var p,
		path = this.path(),
		blanket = this.set();
	
	path.node.addSvgClass('line');
	
	function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
		var l1 = (p2x - p1x) / 2,
			l2 = (p3x - p2x) / 2,
			a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
			b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
		a = p1y < p2y ? Math.PI - a : a;
		b = p3y < p2y ? Math.PI - b : b;
		var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
			dx1 = l1 * Math.sin(alpha + a),
			dy1 = l1 * Math.cos(alpha + a),
			dx2 = l2 * Math.sin(alpha + b),
			dy2 = l2 * Math.cos(alpha + b);
		return {
			x1: p2x - dx1,
			y1: p2y + dy1,
			x2: p2x + dx2,
			y2: p2y + dy2
		};
	}
	
	var y, x;
	for (i = 0, ii = labels.length; i < ii; i++) {
		y = Math.round(height - bottomgutter - Y * values[i]);
		x = Math.round(leftgutter + X * (i + 0.5));
		if (i === 0) {
			p = ["M", x, y, "C", x, y];
		}
		if (i && i < ii - 1) {
			var Y0 = Math.round(height - bottomgutter - Y * values[i - 1]),
				X0 = Math.round(leftgutter + X * (i - 0.5)),
				Y2 = Math.round(height - bottomgutter - Y * values[i + 1]),
				X2 = Math.round(leftgutter + X * (i + 1.5));
			var a = getAnchors(X0, Y0, x, y, X2, Y2);
			p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
		}
		
		var labelTextBottom = this.text(x, height-20, labels[i]);
		labelTextBottom.node.addSvgClass('text down');
		
		var dot = this.circle(x, y, 4);
		dot.node.addSvgClass('dot');
		
		var rect = this.rect(leftgutter + X * i, 0, X, height).attr({fill: '#000', opacity: 0});
		rect.node.addSvgClass('rect');
		
		blanket.push(rect);
		
		collector.push({
			'labelTextBottom': labelTextBottom,
			'dot': dot,
			'rect': rect
		});
	}
	
	var cellHeight = (height - bottomgutter -topgutter ) / vertCells;
	var girdValue = max / vertCells;
	
	for (i = 0; i <= vertCells; i++) {
		var labelTextLeft = this.text(leftgutter+25, height-bottomgutter-i*cellHeight+5, Math.ceil(girdValue *i));
		labelTextLeft.node.addSvgClass('text left');
	}
	
	path.attr({path: p.concat([x, y, x, y])});
	
	return collector;
};