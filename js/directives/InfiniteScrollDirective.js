app.directive('ngInfiniteScroll', ['$window', function($window) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {

			var _$window = angular.element($window);
			var _$message = elem.find('.message');
			var _$loader = elem.find('.load-more');

			var _this = this;
			var _offset = elem.height() - _$window.height();
			var _trigger = _offset - (attrs.ngInfiniteScrollOffset ? attrs.ngInfiniteScrollOffset : 200);
			var _loading = false;
			var _loadCount = 0;

			//  Methods
			var handleEvent = function (e) {
				var eventType = e.type ? e.type : e.name;
				switch(eventType) {
					case 'scroll':
						if (!_loading) monitorScrollPosition();
						break;
					case 'resize':
						_offset = elem.height() - _$window.height();
						if (!_loading) monitorScrollPosition();
						break;
					case 'loadComplete':
						_loading = false;
						break;
				}
			};
			var monitorScrollPosition = function () {
				if (_$window.scrollTop() >= _trigger) {
					_loading = true;
					scope.$emit('loadMoreItems');
					_$loader.show();
				}
				else {
					updateMessage(_offset + ' : ' + _$window.scrollTop());
					_$loader.hide();
				}
			};
			var updateMessage = function (str) {

				_$message.html(str);
			};

			//  Listeners
			_$window.on('scroll', handleEvent);
			_$window.on('resize', handleEvent);
			scope.$on('loadComplete', handleEvent);
		}
  };
}]);