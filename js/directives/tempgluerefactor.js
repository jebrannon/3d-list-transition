app.directive('ngStoryGlue', ['$window', '$interval', '$timeout', function($window, $interval, $timeout) {
	return {
		template: '<li id="{{item.id}}" class="my-list-item {{item.className}}" ng-repeat="item in items"><div class="my-list-inner"><div class="front">{{item.title}}</div><div class="back">{{item.title}}</div></div></li>',
		// templateUrl: '../templates/GridItemView.html',
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			var _$window = angular.element($window);
			var _$body = scope.isIE ? $('html') : $('body');   //  This needs to be 'HTML' for IE.
			var _inited = false;
			var _adjust = attrs.ngStoryGlueAdjust ? attrs.ngStoryGlueAdjust : true;
			var _transEndEventNames = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd';
			var _rows = attrs.ngStoryGlueRows ? Number(attrs.ngStoryGlueRows) : 0;
			var _ratio = attrs.ngStoryGlueHeightRatio ? Number(attrs.ngStoryGlueHeightRatio) : 1;
			var _selector = attrs.ngStoryGlueSelector ? attrs.ngStoryGlueSelector : '.list-item';
			var _items = [];
			var _story = {
				// 'height': 0,
				// 'width': 0,
				'y': 0,
				'fixed_apect': 0
			};

			//  Methods
			var _handleEvent = function (e, attr) {
				var eventType = e.type ? e.type : e.name;
				switch(eventType) {
					case 'debouncedresize':
						_adjustGridLayout();
						break;
					case 'ng_StoryGlue_inject':
						_checkItemsHaveUpdated(attr);
						break;
					case 'ng_StoryGlue_inject':
						_checkItemsHaveUpdated(attr);
						break;
					case 'transitionend':
					case 'webkitTransitionEnd':
					case 'oTransitionEnd':
					case 'otransitionend':
					case 'MSTransitionEnd':
						$(e.target).removeClass('updated');
						$(e.target).off(_transEndEventNames, _handleEvent);
						break;
				}
			};
			var _glueStoryItemsTogether = function () {
				var len = _items.length;
				var inc = 0;
				var _currentRow = 0;
				var col = 0;
				var temp_width = 0;
				var temp_left = 0;


				_returnMaxStoryViewportWidth();


				while (len--) {
					//  Increment temp width in order to compare with grid width
					temp_width = temp_width + _items[inc].width;

					//  Calculate rows and columns values
					if (temp_width > _story.width && _currentRow < (_rows-1)) {
						temp_width = _items[inc].width;
						_currentRow++;
						col = 0;
					}

					//  Adjust columns
					if (col === 0) {
						temp_left = 0;
					}
					else {
						temp_left = temp_left + _items[inc-1].width;
					}

					//  Update item element
					_items[inc].$el.css({
						top: (_items[inc].height * _currentRow),
						left: temp_left,
					});

					//  Incriment columns and index
					col++;
					inc++;
				};
			};
			var _returnMaxStoryViewportWidth = function () {
				var _len = _items.length;
				var _inc = 0;
				var _totalWidth = 0;
				var _itemsLarge = 0;
				var _itemsSmall = 0;
				while (_len--) {
					_totalWidth = _totalWidth + _items[_inc].$el.outerWidth();

					if (_items[_inc].type === 'flat') _itemsLarge++;
					else _itemsSmall++;

					_inc++;

				};
				_totalWidth = _totalWidth/_rows;

				console.log(_items.length);
				console.log('totals: large', _itemsLarge, ' - small', _itemsSmall);
				console.log('_totalWidth', _totalWidth, ' - fixed_apect', _story.fixed_apect);
				console.log(_totalWidth/_story.fixed_apect);
			};
			var _updateStoryItems = function () {
				var _inc = 0;
				var _len = _items.length;
				var _itemHeight = 0;
				var _itemWidth = 0;

				//  Update individual item size and total grid width
				while (_len--) {

					//  Calculate new width and heights
					_itemHeight = _story.fixed_apect;
					if (_items[_inc].type === 'flat') _itemWidth = _story.fixed_apect * 2;
					else _itemWidth = _story.fixed_apect;

					//  Update individual item element size
					_items[_inc].$el.css({
						height: _itemHeight,
						width: _itemWidth
					});

					//  Increment width value based on item width
					_story.width = _story.width + _itemWidth;

					//  Index
					_inc++;
				}
			};
			var _updateItemsReferenceObject = function (data) {

				//  Existing 'items' object is out of date
				if (_items.length !== data.length) {
					var $_items = elem.find('.my-list-item');
					var $_item = false;
					var len = $_items.length;
					var inc = 0;
					var o = {};

					// Ensure what is in the DOM matches the new data set
					if ($_items.length === data.length) {

						//  Reset items object and repopulate
						_items = [];
						while (len--) {

							//  Isolate element
							$_item = $($_items[inc]);

							//  Create new reference object
							o = {
								type: data[inc].className,
								height: 0,
								width: 0,
								$el: $_item
							}

							//  Add to items array
							_items.push(o);

							//  Index
							inc++;
						}

					}
					else {
						console.error('Mismatch between DOM and Data')
					}
				}
			};
			var _updateStoryViewport = function () {
				var _newHeight = Math.ceil(_$window.height() * _ratio);
				var _newY = Math.ceil(_$window.height() * (1-_ratio)/2);

				//  Only update viewport if window size has changed
				if (_newHeight !== _story.height) {
					_story.height = _newHeight;
					_story.y = _newY;

					//  Fixed aspect dimension (item height is always consistent)
					if (_rows > 0) {
						_story.fixed_apect = Math.round(_story.height/_rows);
					}
					else {
						_story.fixed_apect = _story.height;
					}

					//  Adjust viewport element size an position
					elem.css({
						height: _story.height,
						width: _story.width,
						top: _story.y
					});
				};
			};
			var _updateOnceDataLoaded = function (data) {

				//  
				_updateItemsReferenceObject(data);
				_adjustGridLayout();

				//  Initial animation
				// if (!_inited) {
				// 	_$body.scrollLeft((_story.width - _$window.width())/2);
				// 	elem.addClass('animate');
				// 	_$body.animate({scrollLeft: 0}, 2000);
				// 	_inited = true;
				// }

				//  The DOM is ready
				scope.$emit("ng_StoryGlue_ready");
			};
			var _checkItemsHaveUpdated = function (data) {
				/*  This is a horrible hack fix to ensure the DOM is ready for manipulation one data maping has occured.
				    the 'link' function we are currently in is fired when the template is cloned but not upon template render.
				    this would normally be fine for most manipulation but the grid need to instantaneously adjust on render  */
				var _$items = elem.find(_selector);
				var _checkDOM = $interval(function(){
					_$items = elem.find(_selector);
					if (_$items.length > 0) {
						$interval.cancel(_checkDOM);
						_updateOnceDataLoaded(data);
					}
				}, 1);
			};
			var _adjustGridLayout = function () {

				//  Make the calculations required to adjust to DOM
				_updateStoryViewport();
				_updateStoryItems();
				_glueStoryItemsTogether();
			};
			var _storyItemContentHasUpdated = function (e, arr) {
				var len = arr.length;
				while (len--) {
					_items[arr[len]].$el.addClass('updated');
					_items[arr[len]].$el.on(_transEndEventNames, _handleEvent);
				}
			};

			//  Listeners
			if (_adjust) _$window.on("debouncedresize", _handleEvent);
			scope.$on("ng_StoryGlue_inject", _handleEvent);
			scope.$on("ng_StoryGlue_update", _handleEvent);
		}
  };
}]);