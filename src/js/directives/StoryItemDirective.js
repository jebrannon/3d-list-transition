var StoryItemDirective = function ($window) {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			var _$window = angular.element($window);
			var _memory = {x:0, y:0, w:0, h:0};
			var _margin = attrs.ngStoryItemMargin ? Number(attrs.ngStoryItemMargin) : 50;
			var _transEndEventNames = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd';
			var _selector = attrs.ngStoryItemSelector ? attrs.ngStoryItemSelector : '.list-item';
			var _class = _selector.replace('.','').replace('#','');
			var _triggerAuto = true;

			//  Methods
			var _handleEvent = function (e, attr) {
				var _eventType = e.type ? e.type : e.name;
				switch(_eventType) {
					case 'click':
						if (!scope.auto) {
							_itemWasSelected(angular.element(e.target));
						};
						break;
					case 'ng_StoryItem_select':
					case 'ng_StoryItem_close':
						_itemWasSelected(attr);
						break;
					case 'transitionend':
					case 'webkitTransitionEnd':
					case 'oTransitionEnd':
					case 'otransitionend':
					case 'MSTransitionEnd':
						_itemHasClosed(angular.element(e.target));
						break;
				}
			};
			var _handleEventBubbling = function ($el, _class) {
				/*
					This method's only purpose is to get around IE <11 lack of support for 'pointer-events:none'
				*/
				var limit = 5;
				var _$el = $el;
				while (limit--) {
					if (_$el && _$el.hasClass(_class)) {
						return _$el;
					}
					_$el = _$el.parent();
				}
				return false;
			};
			var _itemWasSelected = function (item) {
				var _$el = false;

				/*  
					Here we need to define the selected item under a number of circumstances
					1.  no item provided
					2.  item provided as an index value
					3.  item provided as an element
				*/

				//  1.
				if (!item) {
					var _openItem = _findItemsAlreadyOpen();
					if (!_openItem) return;
					else {
						_$el = _findItemsAlreadyOpen();
					}

					//  Ensure we don't trigger StoryAuto this time
					_triggerAuto = false;
				}
				//  2.
				else if ($.isNumeric(item)) {
					var _$items = elem.find(_selector);
					_$el = angular.element($items[item]);
				}
				//  3.
				else {
					if (scope.isIE) {
						_$el = _handleEventBubbling(item, _class);
					}
					else _$el = item;
				}

				/*  
					Now we have the item we can carry on with opening it
				*/
				var _isValidItem = _$el.hasClass(_class);
				var _isOpen = _$el.hasClass('focus');
				
				//  Ensure we have a valid StoryItem item
				if (_isValidItem) {

					//  If a StoryItem is not already open, open it.
					if (!_isOpen) {
						_beginOpenItem(_$el);
					}
					//  Otherwise close it
					else {
						_beginCloseItem(_$el);
					}
				}
			};
			var _beginOpenItem = function ($el) {

				//  Prevent scroll and disable items
				var _$items = elem.find(_selector);
				_$items.addClass('disable');
				$('body').addClass('prevent-scroll');

				//  Listeners for opening item animation
				elem.on(_transEndEventNames, _handleEvent);
				
				//  Open the item
				$el.addClass('focus');
				_expandItemToFront($el);
			};
			var _beginCloseItem = function ($el) {
				$el.removeClass('focus');
				$el.css({
					width: _memory.w,
					height: _memory.h,
					top: _memory.y,
					left: _memory.x
				});

				//  Add listeners for transition
				elem.on(_transEndEventNames, _handleEvent);

				/*
					The logic here is whether or not to tell StoryAuto to continue playback.
					At the start of every StoryAuto sequence it closes any items that are already open,
					however in this case we dont want to trigger trigger it again.
					When in auto mode we would normally use this method to tell StoryAuto to start another sequen
				*/
				if (scope.auto && _triggerAuto) {
					scope.$emit('ng_StoryAuto_play');
				}
				else if (scope.auto && !_triggerAuto) {
					_triggerAuto = true;
				}
			};
			var _itemHasClosed = function ($el) {
				var _isValidItem = $el.hasClass(_class);
				if (_isValidItem) {

					//  Ensure the item is actually selected
					if (!$el.hasClass('focus')) {

						//  Enable scroll and enable items
						var _$items = elem.find(_selector);
						_$items.removeClass('disable');
						$('body').removeClass('prevent-scroll');
					};

					//  Remove transition listeners
					elem.off(_transEndEventNames, _handleEvent);
				}
			};
			var _expandItemToFront = function ($el) {
				_memory.x = $el.position().left;
				_memory.y = $el.position().top;
				_memory.w = $el.outerWidth();
				_memory.h = $el.outerHeight();
				var _width = _$window.width() - (_margin * 2);
				var _height = _$window.height() - (_margin * 2);

				//  Update element
				$el.css({
					width: _width,
					height: _height,
					top: _margin - elem.position().top,
					left: _margin + _$window.scrollLeft()
				});
			};
			var _findItemsAlreadyOpen = function () {
				var _$items = elem.find(_selector);
				var _len = _$items.length;
				while (_len--) {
					if ($(_$items[_len]).hasClass('focus')) {
						return $(_$items[_len]);
					}
				}
			};

			//  Listeners for manual mode
			elem.on('click', _handleEvent);
			scope.$on("ng_StoryItem_select", _handleEvent);
			scope.$on("ng_StoryItem_close", _handleEvent);
		}
  };
};
module.exports = StoryItemDirective;