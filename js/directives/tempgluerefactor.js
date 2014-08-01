app.directive('ngStoryGlue', ['$window', '$interval', '$timeout', function($window, $interval, $timeout) {
	return {
		template: '<li id="{{item.id}}" class="my-list-item {{item.className}}" ng-repeat="item in items"><div class="my-list-inner"><div class="front">{{item.title}}</div><div class="back">{{item.title}}</div></div></li>',
		// templateUrl: '../templates/GridItemView.html',
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			var _$window = angular.element($window);
			var _$body = scope.isIE ? $('html') : $('body');   //  This needs to be HTML for IE
			var _inited = false;
			var _adjust = attrs.ngStoryGlueAdjust ? attrs.ngStoryGlueAdjust : true;
			var _transEndEventNames = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd';
			var _rows = attrs.ngStoryGlueRows ? Number(attrs.ngStoryGlueRows) : 0;
			var _ratio = attrs.ngStoryGlueHeightRatio ? Number(attrs.ngStoryGlueHeightRatio) : 1;
			var _selector = attrs.ngStoryGlueSelector ? attrs.ngStoryGlueSelector : '.list-item';
			var _items = [];
			var _story = {
				'height': 0,
				'width': 0,
				'y': 0,
				'fixed_apect': 0
			};

			//  Methods
			var _handleEvent = function (e, attr) {
				var eventType = e.type ? e.type : e.name;
				switch(eventType) {
					case 'debouncedresize':
						_adjustStoryLayout();
						break;
					case 'ng_StoryGlue_inject':
						_checkElementsAreReady(attr);
						break;
					case 'ng_StoryGlue_update':
						_updateExistingItems(attr);
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
			var _glueStoryItemsTogether = function (data) {
				var len = _items.length;
				var inc = 0;
				var row = 0;
				var col = 0;
				var temp_width = 0;
				var temp_left = 0;

				while (len--) {
					//  Increment temp width in order to compare with grid width
					temp_width = temp_width + _items[inc].width;

					//  Calculate rows and columns values
					if (temp_width > _story.width && row < (_rows-1)) {
						temp_width = _items[inc].width;
						row++;
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
						height: _items[inc].height,
						width: _items[inc].width,
						top: (_items[inc].height * row),
						left: temp_left,
					});

					//  Incriment columns and index
					col++;
					inc++;
				};
			};
			var _updateGridAndItemsObject = function (data) {
				var _inc = 0;
				var _len = data.length;
				var _height = Math.ceil(_$window.height() * _ratio);
				var _y = Math.ceil(_$window.height() * (1-_ratio)/2);
				var _itemHeight = (_rows>0) ? Math.round(_height/_rows) : _height;
				var _$items = elem.find(_selector);

				/*
					Update Story size and position attributes
				*/
				_story.width = 0;
				_story.height = _height;
				_story.y = _y;

				/*
					Reset items reference
				*/
				_items = [];

				/*
					Update individual item size and total Story width
				*/
				while (_len--) {

					//  Create new item
					_items.push({});
					_items[_inc].type = data[_inc].className;
					_items[_inc].$el = angular.element(_$items[_inc]);

					//  Height is always consistent
					_items[_inc].height = _itemHeight;

					//  Width is based on centent type
					if (_items[_inc].type === 'media') {
						_items[_inc].width = _itemHeight * 2;
					}
					else {
						_items[_inc].width = _itemHeight;
					}

					//  Increment width value based on item width
					_story.width = _story.width + _items[_inc].width;

					//  Index
					_inc++;
				}

				/*
					Calculate Story row width
				*/
				if (_rows > 0) {
					_story.width = Math.ceil(_story.width/_rows);
				}
			};
			var _updateItemSize = function (data) {
				var _$items = elem.find(_selector);
				var _$item = false;
				var _len = _$items.length;
				var _index = 0;
				var _storyHeight = Math.ceil(_$window.height() * _ratio);
				var _storyWidth = 0;
				var _totalWidth = 0;
				var _y = Math.ceil(_$window.height() * (1-_ratio)/2);
				var _itemHeight = (_rows>0) ? Math.round(_storyHeight/_rows) : _storyHeight;
				
				/*
					Calculations for
					- item sizing
					- total width
				*/
				while (_len--) {
					_$item = angular.element(_$items[_index]);
					_$item.height(_itemHeight);

					//  Update width
					if (_$item.hasClass('media')) _$item.width(_itemHeight*2);
					else _$item.width(_itemHeight);

					//  Add item widths
					_totalWidth = _totalWidth + _$item.width();

					//  Increment index
					_index++
				}

				_storyWidth = Math.ceil(_totalWidth / _rows);

				elem.css({
					height: _storyHeight,
					width: _storyWidth,
					top: _y
				});



				_len = _$items.length;
				_index = 0;
				_totalWidth = 0;
				var _x = 0;
				var _currentRow = 0;
				var _col = 0;
				while (_len--) {
					_$item = angular.element(_$items[_index]);

					//  Increment temp width in order to compare with grid width
					_totalWidth = _totalWidth + _$item.outerWidth();

console.log(_$item.width());
console.log(_$item.outerWidth());
console.log('--');

					//  Calculate rows and columns values
					if (_totalWidth > _storyWidth) {
						_totalWidth = _$item.outerWidth();
						_currentRow++;
						_col = 0;
					}

					//  Adjust columns
					if (_col === 0) {
						_x = 0;
					}
					else {
						_x = _x + angular.element(_$items[_index-1]).outerWidth();
					}
					
					//  Update item element
					_$item.css({
						top: _itemHeight * _currentRow,
						left: _x,
					});

					//  Increment columns and index
					_col++;
					_index++;
				};


			};
			var _updateOnceDataLoaded = function (data) {

				//  
				// _syncItemsReferenceToData(data);
				_adjustStoryLayout(data);

				//  Initial animation
				// if (!_inited) {
				// 	_$body.scrollLeft((_story.width - _$window.width())/2);
					elem.addClass('animate');
				// 	_$body.animate({scrollLeft: 0}, 2000);
				// 	_inited = true;
				// }

				//  The DOM is ready
				scope.$emit("ng_StoryGlue_ready");
			};
			var _checkElementsAreReady = function (data) {
				/*  This is a horrible hack fix to ensure the DOM is ready for manipulation one data maping has occured.
				    the 'link' function we are currently in is fired when the template is cloned but not upon template render.
				    this would normally be fine for most manipulation but the grid need to instantaneously adjust on render  */
				var $items = elem.find(_selector);
				var checkDOM = $interval(function(){
					$items = elem.find(_selector);
					if ($items.length > 0) {
						$interval.cancel(checkDOM);
						_updateOnceDataLoaded(data);
					}
				}, 1);
			};
			var _adjustStoryLayout = function (data) {

				//  Make the calculations required to adjust the DOM
				// _updateGridAndItemsObject(data);
				_updateItemSize(data);

				//  Position parent viewport
				// elem.css({
				// 	height: _story.height,
				// 	width: _story.width,
				// 	top: _story.y
				// });

				//  Glue items grid together
				// _glueStoryItemsTogether(data);
			};
			var _updateExistingItems = function (arr) {
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