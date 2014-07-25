app.directive('ngGrid', ['$window', function($window) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			var _$window = angular.element($window);
			var _memory = {x:0, y:0, w:0, h:0}
			var _margin = 40;
			var _open = false;
			var _transEndEventNames = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd';
console.log('ngGrid');
			//  Methods
			var handleEvent = function (e) {
				var eventType = e.type ? e.type : e.name;
				switch(eventType) {
					case 'click':
						if (!_open && $(e.target).hasClass('my-list-item')) {
							openItem(angular.element(e.target));
						}
						else {
							closeItem(angular.element(e.target));
						}
						break;
					case 'transitionend':
					case 'webkitTransitionEnd':
					case 'oTransitionEnd':
					case 'otransitionend':
					case 'MSTransitionEnd':
						if ($(e.target).hasClass('my-list-item')) {
							if (!$(e.target).hasClass('focus')) {
								var $items = elem.find('.my-list-item');
								$items.removeClass('disable');
							}
							elem.off(_transEndEventNames, handleEvent);
						}
						break;
				}
			};
			var openItem = function ($el) {
				var $items = elem.find('.my-list-item');
				$items.addClass('disable');
				_open = true;
				elem.on(_transEndEventNames, handleEvent);

				console.log($el[0])


				$el.addClass('focus');
				$el.data('data-opening', 'true')
				centralizeGridItem($el);
			};
			var closeItem = function ($el) {
				var $items = elem.find('.my-list-item ');
				$el.removeClass('focus');
				_open = false;
				$el.css({
					width: _memory.w,
					height: _memory.h,
					top: _memory.y,
					left: _memory.x
				});
				elem.on(_transEndEventNames, handleEvent);
			};
			var centralizeGridItem = function ($el) {
				_memory.x = $el.position().left;
				_memory.y = $el.position().top;
				_memory.w = $el.width();
				_memory.h = $el.height();
				var width = _$window.width() - (_margin * 2);
				var height = _$window.height() - (_margin * 2);

				console.log('width', width);
				console.log('height', height);
				console.log('window', _$window[0]);

				elem.append('<p style="position: absolute;bottom: 0">'+height+$window+'</p>')

				$el.css({
					width: width,
					height: height,
					top: _margin,
					left: _margin
				});
			};

			//  Listeners
			elem.on('click', handleEvent);
		}
  };
}]);