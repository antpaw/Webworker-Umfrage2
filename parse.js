var createPies = new Class({
	Implements: [Options, Events],
	
	options: {
		data: null
	},
	version: '0.1',
	data: null,
	
	initialize: function(data, opts){
		if (!$defined(data)) return;
		
		this.setOptions(opts);
		
		this.data = data;
		
		this.createPie('geschlecht');
	},
	
	createPie: function(prop){
		var values = {
			m: 0,
			w: 0,
			o: 0,
			e: 0
		};
		
		this.data.each(function(vote){
			value[vote[prop]]++;
		});
		
	    r("holder", 700, 700).pieChart(
			350, 350, 200, [
				values.m, values.w, values.o, values.e
			],
			['a', 'b', 'c', 'd'],
			"#fff"
		);
	    
	}
});