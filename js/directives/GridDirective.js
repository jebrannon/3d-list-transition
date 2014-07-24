app.directive('ngGrid', ['$window', function($window) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			var _$window = angular.element($window);
			var _memory = {x:0, y:0, w:0, h:0}
			var _margin = 40;
			var _open = false;

			//  Methods
			var handleEvent = function (e) {
				var eventType = e.type ? e.type : e.name;
				switch(eventType) {
					case 'click':

						var $el = angular.element(e.target);
						$el.toggleClass('focus');
						if (!_open) {
							_open = true;
							centralizeGridItem($el);
						}
						else {
							_open = false;
							closeGridItem($el);
						}

						break;
				}
			};
			var centralizeGridItem = function ($el) {
				_memory.x = $el.position().left;
				_memory.y = $el.position().top;
				_memory.w = $el.width();
				_memory.h = $el.height();
				var width = _$window.width() - (_margin * 2);
				var height = _$window.height() - (_margin * 2);

				$el.width(width);
				$el.height(height);

				$el.css({top: _margin});
				$el.css({left: _margin});

			};
			var closeGridItem = function ($el) {
				console.log('closeGridItem', $el)

				// $el.css("height", null);
				// $el.css("width", null);

				$el.css({
					width: _memory.w,
					height: _memory.h,
					top: _memory.y,
					left: _memory.x
				});

			};
			// var monitorScrollPosition = function () {
			// 	if (_$window.scrollTop() >= _trigger) {
			// 		_loading = true;
			// 		scope.$emit('loadMoreItems');
			// 		_$loader.show();
			// 	}
			// 	else {
			// 		updateMessage(_offset + ' : ' + _$window.scrollTop());
			// 		_$loader.hide();
			// 	}
			// };
			// var updateMessage = function (str) {

			// 	_$message.html(str);
			// };

			//  Listeners
			elem.on('click', handleEvent);
			// _$window.on('scroll', handleEvent);
			// _$window.on('resize', handleEvent);
			// scope.$on('loadComplete', handleEvent);
		}
  };
}]);