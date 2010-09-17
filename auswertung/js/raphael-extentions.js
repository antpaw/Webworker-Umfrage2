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
    var process = function(j){
		var value = values[j],
			angleplus = 360 * value / total,
			popangle = angle + (angleplus / 2),
			ms = 300,
			delta = 30,
			p = sector(cx, cy, r, angle, angle + angleplus);
			
		p.node.id = name+'_chart_'+j;
			
		p.mouseover(function(){
			p.animate({scale: [1.1, 1.1, cx, cy]}, ms, "backOut");
			$(p.node.id.replace('_chart_', '_label_')).addClass('hover');
		}).mouseout(function(){
			p.animate({scale: [1, 1, cx, cy]}, ms, "backIn");
			$(p.node.id.replace('_chart_', '_label_')).removeClass('hover');
		}).click(function(){
			console.log(p.id);
		});
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

	return chart;
};







Raphael.fn.drawGrid = function(x, y, w, h, wv, hv, color){
    color = color || "#000";
    var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
        rowHeight = h / hv,
        columnWidth = w / wv;
    for (var i = 1; i < hv; i++) {
        path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
    }
    for (i = 1; i < wv; i++) {
        path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
    }
	
    return this.path(path.join(",")).attr({stroke: color});
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

var tokenRegex = /\{([^\}]+)\}/g,
objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, // matches .xxxxx or ["xxxxx"] to run over object properties
replacer = function (all, key, obj) {
    var res = obj;
    key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
        name = name || quotedName;
        if (res) {
            if (name in res) {
                res = res[name];
            }
            typeof res == "function" && isFunc && (res = res());
        }
    });
    res = (res == null || res == obj ? all : res) + "";
    return res;
},
fill = function (str, obj) {
    return String(str).replace(tokenRegex, function (all, key) {
        return replacer(all, key, obj);
    });
};
Raphael.fn.popup = function (X, Y, set, pos, ret) {
    pos = String(pos || "top-middle").split("-");
    pos[1] = pos[1] || "middle";
    var r = 5,
        bb = set.getBBox(),
        w = Math.round(bb.width),
        h = Math.round(bb.height),
        x = Math.round(bb.x) - r,
        y = Math.round(bb.y) - r,
        gap = Math.min(h / 2, w / 2, 10),
        shapes = {
            top: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}l-{right},0-{gap},{gap}-{gap}-{gap}-{left},0a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
            bottom: "M{x},{y}l{left},0,{gap}-{gap},{gap},{gap},{right},0a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
            right: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}l0-{bottom}-{gap}-{gap},{gap}-{gap},0-{top}a{r},{r},0,0,1,{r}-{r}z",
            left: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}l0,{top},{gap},{gap}-{gap},{gap},0,{bottom}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z"
        },
        offset = {
            hx0: X - (x + r + w - gap * 2),
            hx1: X - (x + r + w / 2 - gap),
            hx2: X - (x + r + gap),
            vhy: Y - (y + r + h + r + gap),
            "^hy": Y - (y - gap)
            
        },
        mask = [{
            x: x + r,
            y: y,
            w: w,
            w4: w / 4,
            h4: h / 4,
            right: 0,
            left: w - gap * 2,
            bottom: 0,
            top: h - gap * 2,
            r: r,
            h: h,
            gap: gap
        }, {
            x: x + r,
            y: y,
            w: w,
            w4: w / 4,
            h4: h / 4,
            left: w / 2 - gap,
            right: w / 2 - gap,
            top: h / 2 - gap,
            bottom: h / 2 - gap,
            r: r,
            h: h,
            gap: gap
        }, {
            x: x + r,
            y: y,
            w: w,
            w4: w / 4,
            h4: h / 4,
            left: 0,
            right: w - gap * 2,
            top: 0,
            bottom: h - gap * 2,
            r: r,
            h: h,
            gap: gap
        }][pos[1] == "middle" ? 1 : (pos[1] == "top" || pos[1] == "left") * 2];
        var dx = 0,
            dy = 0,
            out = this.path(fill(shapes[pos[0]], mask)).insertBefore(set);
        switch (pos[0]) {
            case "top":
                dx = X - (x + r + mask.left + gap);
                dy = Y - (y + r + h + r + gap);
            break;
            case "bottom":
                dx = X - (x + r + mask.left + gap);
                dy = Y - (y - gap);
            break;
            case "left":
                dx = X - (x + r + w + r + gap);
                dy = Y - (y + r + mask.top + gap);
            break;
            case "right":
                dx = X - (x - gap);
                dy = Y - (y + r + mask.top + gap);
            break;
        }
        out.translate(dx, dy);
        if (ret) {
            ret = out.attr("path");
            out.remove();
            return {
                path: ret,
                dx: dx,
                dy: dy
            };
        }
        set.translate(dx, dy);
        return out;
};