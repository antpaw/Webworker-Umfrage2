Element.implement({
	hasSvgClass: function(className){
		return this.className.baseVal.contains(className, ' ');
	},
	
	addSvgClass: function(className){
		this.className.baseVal = this.className.baseVal + ' ' + className;
		if (!this.hasSvgClass(className)) this.className.baseVal = (this.className.baseVal + ' ' + className).clean();
		return this;
	},
	
	removeSvgClass: function(className){
		this.className.baseVal = this.className.baseVal.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
		return this;
	}
});

Hash.implement({
	isEmpty: function(){
		for (var prop in this) {
			if (this.hasOwnProperty(prop)) {
				return false;
			}
		}
		return true;
	}
});