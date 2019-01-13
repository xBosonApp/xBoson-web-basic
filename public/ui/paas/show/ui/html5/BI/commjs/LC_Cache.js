
(function($) {



$.cache = {};
$.extend($.cache, {


	map : {},


	push : function(key, value) {
		$.cache.map[key] = value;
	},


	remove : function(key) {
		delete($.cache.map[key]);
	},


	clear : function() {
		$.cache.map = {};
	},


	get : function(key) {
		return $.cache.map[key];
	}


});


})(jQuery);
