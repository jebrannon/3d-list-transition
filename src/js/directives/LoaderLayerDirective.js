var LoaderLayerDirective = function ($window) {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {

			//  Methods
			var _handleEvent = function (e, attr) {
				var _eventType = e.type ? e.type : e.name;
				switch(_eventType) {
					case 'ng_LoadingLayer_remove':
						console.log('ng_LoadingLayer_remove');
						elem.addClass('hide');
						break;
				}
			};
			//  Listeners
			scope.$on("ng_LoadingLayer_remove", _handleEvent);
		}
  };
};
module.exports = LoaderLayerDirective;