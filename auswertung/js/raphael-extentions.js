Raphael.fn.pieChart = function (cx, cy, r, values, name) {
	var paper = this;
	var rad = Math.PI / 180;
	var chart = this.set();
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
    var process = function (j) {
		var value = values[j],
			angleplus = 360 * value / total,
			popangle = angle + (angleplus / 2),
			ms = 300,
			delta = 30,
			p = sector(cx, cy, r, angle, angle + angleplus);
			
		p.id = name+'_chart_'+j;
			
		p.mouseover(function(){
			p.animate({scale: [1.1, 1.1, cx, cy]}, ms, "backOut");
			$(p.id.replace('_chart_', '_label_')).addClass('hover');
		}).mouseout(function(){
			p.animate({scale: [1, 1, cx, cy]}, ms, "backIn");
			$(p.id.replace('_chart_', '_label_')).removeClass('hover');
		});
		angle += angleplus;
		chart.push(p);
		start += .1;
	};
	var i;
	
	for (i = 0, ii = values.length; i < ii; i++) {
		total += values[i];
	}
	for (i = 0; i < ii; i++) {
		process(i);
	}

	return chart;
};