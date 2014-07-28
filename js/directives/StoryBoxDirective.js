app.directive('ngStoryBox', ['$window', function($window) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			var _$window = angular.element($window);
			var _memory = {x:0, y:0, w:0, h:0};
			var _margin = 50;
			var _open = false;
			var _transEndEventNames = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd';
			var _items = [];
			var _rows = 3;

			//  Methods
			var handleEvent = function (e) {
				var eventType = e.type ? e.type : e.name;
				switch(eventType) {
					case 'click':
						userItemSelect(angular.element(e.target));
						break;
					case 'transitionend':
					case 'webkitTransitionEnd':
					case 'oTransitionEnd':
					case 'otransitionend':
					case 'MSTransitionEnd':
						transtitionManager(angular.element(e.target));
						break;
				}
			};
			var userItemSelect = function ($el) {
				var _isValidItem = $el.hasClass('my-list-item');
				var bubble = eventBubbling($el, 'my-list-item');

				if (!_isValidItem && bubble) {
					_isValidItem = true;
					$el = bubble;
				}

				if (!_open && _isValidItem) {
					openItem($el);
				}
				else if (_open && _isValidItem) {
					closeItem($el);
				}
			};
			var openItem = function ($el) {
				var $items = elem.find('.my-list-item');
				$items.addClass('disable');
				_open = true;
				elem.on(_transEndEventNames, handleEvent);
				$el.addClass('focus');
				centralizeGridItem($el);
			};
			var closeItem = function ($el) {
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
				_memory.w = $el.outerWidth();
				_memory.h = $el.outerHeight();
				var width = _$window.width() - (_margin * 2);
				var height = _$window.height() - (_margin * 2);

				console.log(elem.position().left)

				$el.css({
					width: width,
					height: height,
					top: _margin,
					left: _margin
				});
			};
			var transtitionManager = function ($el) {
				var _isValidItem = $el.hasClass('my-list-item');
				var $items = elem.find('.my-list-item');
				if (_isValidItem) {
					if (!$el.hasClass('focus')) {
						$items.removeClass('disable');
					}
					elem.off(_transEndEventNames, handleEvent);
				}
			};
			var eventBubbling = function ($el, param) {
				var limit = 5;
				var el = $el[0];
				while (limit--) {
					if ($(el).parent() && $(el).parent().hasClass(param)) {
						return $(el).parent();
					}
					el = $(el).parent();
				}
				return false;
			};

			//  Listeners
			elem.on('click', handleEvent);		
		}
  };
}]);