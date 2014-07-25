app.directive('ngGrid', ['$window', function($window) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			var _$window = angular.element($window);
			var _memory = {x:0, y:0, w:0, h:0}
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
			var gridGlue = function () {

				var height = Math.ceil(_$window.height() * .8);
				var itemHeight = Math.ceil(height * .33);
				elem.height(height);

				var $items = elem.find('.my-list-item');
				var $item = false;
				var len = $items.length;
				var inc = 0;
				var o = {};
				var twidth = 0;

				while (len--) {
					$item = $($items[inc]);
					o = {
						h: itemHeight,
						w: itemHeight,
						top: 0,
						left: 0,
						$el: $item
					}
					if ($item.hasClass('large')) {
						o.w = itemHeight * 2;
					}
					twidth = twidth + o.w;
					_items.push(o);
					inc++;
				}

				len = _items.length;
				inc = 0;
				row = 0;
				col = 0;
				var width_limiter = twidth/_rows;
				var temp_width = 0;
				var temp_left;

				while (len--) {

					temp_width = temp_width + _items[inc].w;
					if (temp_width > width_limiter && row < (_rows-1)) {
						temp_width = _items[inc].w;
						row++;
						col = 0;
					}

					if (col === 0) {
						temp_left = 0;
					}
					else {
						temp_left = temp_left + _items[inc-1].w;
					}

					_items[inc].$el.css({
						height: _items[inc].h,
						width: _items[inc].w,
						top: _items[inc].h * row,
						left: temp_left,
					});

					col++;
					inc++;

					if (len === 0) {
						elem.width(temp_width);
					}

				};
			};

			//  Listeners
			elem.on('click', handleEvent);
			gridGlue();
		}
  };
}]);