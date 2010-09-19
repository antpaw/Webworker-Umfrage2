var scrollNotebar = new Class({
	Implements: [Options],

	options: {
		offsets: { x:0, y:0 },
		mode: 'vertical'
	},

	initialize: function(menu, options) {
		this.setOptions(options);
		
		this.menu = menu;
		this.move = this.options.mode == 'vertical' ? 'y' : 'x';
		
		window.addEvent('scroll', this.scrollListener.bind(this));
		this.scrollListener();
	},
	
	scrollListener: function() {
		var marginTop = this.options.offsets[this.move] - $(document.body).getScroll()[this.move];
		if (marginTop < 0) {
			marginTop = 0;
		}
		
		this.menu.setStyles({'margin-top': marginTop});
	}
});
