var Promise = require('./promise');

function Route(path,controller) {
	
	var capture,captures,length;
	
	this.controller = controller;
	this.params = {};
	this.regex = path;
	this.route = path;
	
	captures = this.route.match(/:([^\/]+)/ig);
	
	if (captures) {
		
		length = captures.length;
		
	    for (var i = 0; i < length; i++) {
	    	
	    	capture = captures[i];
	    	
	    	this.params[capture.replace(':','')] = null;
	    	
	    	this.regex = this.regex.replace(capture,'([a-zA-Z0-9]+)');
	    	
	  	}
	  	
	}
	
	this.regex = new RegExp(this.regex);
	
}

Route.prototype.match = function (url) {
	
	var self = this,
		path = url.pathname || '/',
		match = self.regex.exec(path);
	
	//console.log('Route.match',path,self.regex);
	
	if (null != match && match[0] == path) {
		
		//console.log('Route.match',match[0],path);
			
		var index = 1;
		
		for (var i in self.params) {
		
			self.params[i] = match[index];
			
			index++;
			
		}
		
		return(self);
		
	} else {
	
		return(false);
		
	}
	
};

module.exports = Route;