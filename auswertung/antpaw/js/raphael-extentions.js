Raphael.fn.pieChart = function (cx, cy, r, values) {
	var paper = this;
	var rad = Math.PI / 180;
	var chart = this.set();
	var slices = [];
	function sector(cx, cy, r, startAngle, endAngle) {
		var x1 = cx + r * Math.cos(-startAngle * rad),
			x2 = cx + r * Math.cos(-endAngle * rad),
			y1 = cy + r * Math.sin(-startAngle * rad),
			y2 = cy + r * Math.sin(-endAngle * rad);
		return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]);
	}
	
	var angle = 0;
	var total = 0;
	var start = 0;
	var process = function(j){
		var value = values[j],
			angleplus = 360 * value / total,
			popangle = angle + (angleplus / 2),
			p = sector(cx, cy, r, angle, angle + angleplus);
		
		slices.push(p);
		angle += angleplus;
		chart.push(p);
		start += .1;
	};
	var i, ii;
	
	for (i = 0, ii = values.length; i < ii; i++) {
		total += values[i];
	}
	for (i = 0; i < ii; i++) {
		process(i);
	}

	return slices;
};


Raphael.fn.drawGrid = function(x, y, w, h, wv, hv){
	var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
		rowHeight = h / hv,
		columnWidth = w / wv;
	for (var i = 1; i < hv; i++) {
		path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
	}
	for (i = 1; i < wv; i++) {
		path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
	}
	
	return this.path(path.join(",")).node.setAttribute('class', 'grid');
};


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