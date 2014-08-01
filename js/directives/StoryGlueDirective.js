app.directive('ngStoryGlue', ['$window', '$interval', '$timeout', function($window, $interval, $timeout) {
	return {
		template: '<li id="{{item.id}}" class="my-list-item {{item.className}}" ng-repeat="item in items"><div class="my-list-inner"><div class="front">{{item.title}}</div><div class="back">{{item.title}}</div></div></li>',
		// templateUrl: '../templates/GridItemView.html',
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			var _$window = angular.element($window);
			var _inited = false;
			var _adjust = attrs.ngStoryGlueAdjust ? attrs.ngStoryGlueAdjust : true;
			var _transEndEventNames = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd';
			var _rows = attrs.ngStoryGlueRows ? Number(attrs.ngStoryGlueRows) : 0;
			var _ratio = attrs.ngStoryGlueHeightRatio ? Number(attrs.ngStoryGlueHeightRatio) : 1;
			var _selector = attrs.ngStoryGlueSelector ? attrs.ngStoryGlueSelector : '.list-item';
			var _items = [];
			var _grid = {
				'height': 0,
				'width': 0,
				'y': 0,
				'fixed_apect': 0
			};

			//  Methods
			var handleEvent = function (e) {
				var eventType = e.type ? e.type : e.name;
				switch(eventType) {
					case 'debouncedresize':
						adjustGridLayout();
						break;
					case 'transitionend':
					case 'webkitTransitionEnd':
					case 'oTransitionEnd':
					case 'otransitionend':
					case 'MSTransitionEnd':
						$(e.target).removeClass('updated');
						$(e.target).off(_transEndEventNames, handleEvent);
						break;
				}
			};
			var positionGridItems = function () {
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
					if (temp_width > _grid.width && row < (_rows-1)) {
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
			var updateGridAndItemsObject = function () {
				var inc = 0;
				var len = _items.length;

				//  Reset grid width
				_grid.width = 0;

				//  Height and Y position
				_grid.height = Math.ceil(_$window.height() * _ratio);
				_grid.y = Math.ceil(_$window.height() * (1-_ratio)/2);

				//  Fixed aspect dimension (the width or height is always consistent depending on alignment)
				if (_rows > 0) {
					_grid.fixed_apect = Math.round(_grid.height/_rows);
				}
				else {
					_grid.fixed_apect = _grid.height;
				}

				//  Update individual item size and total grid width
				while (len--) {

					_items[inc].height = _grid.fixed_apect;
					if (_items[inc].type === 'media') {
						_items[inc].width = _grid.fixed_apect * 2;
					}
					else {
						_items[inc].width = _grid.fixed_apect;
					}

					//  Increment width value based on item width
					_grid.width = _grid.width + _items[inc].width;

					//  Index
					inc++;
				}

				//  Calculate total grid width based on rows
				if (_rows > 0) {
					_grid.width = Math.ceil(_grid.width/_rows);
				}
			};
			var updateItemsObject = function (data) {

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

							$_item = $($_items[inc]);
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
			var updateOnceDataLoaded = function (data) {

				//  
				updateItemsObject(data);
				adjustGridLayout();

				//  Initial animation
				if (!_inited) {
					$('html, body').scrollLeft((_grid.width - _$window.width())/2);
					elem.addClass('animate');
					$('html, body').animate({scrollLeft: 0}, 2000);
					_inited = true;
				}

				//  The DOM is ready
				scope.$emit("ng_StoryGlue_ready");
			};
			var checkItemsHaveUpdated = function (e, data) {
				/*  This is a horrible hack fix to ensure the DOM is ready for manipulation one data maping has occured.
				    the 'link' function we are currently in is fired when the template is cloned but not upon template render.
				    this would normally be fine for most manipulation but the grid need to instantaneously adjust on render  */
				var $items = elem.find(_selector);
				var checkDOM = $interval(function(){
					$items = elem.find(_selector);
					if ($items.length > 0) {
						$interval.cancel(checkDOM);
						updateOnceDataLoaded(data);
					}
				}, 1);
			};
			var adjustGridLayout = function () {

				//  Make the calculations required to adjust to DOM
				updateGridAndItemsObject();

				//  Position parent viewport
				elem.css({
					height: _grid.height,
					width: _grid.width,
					top: _grid.y
				});

				//  Glue items grid together
				positionGridItems();
			};
			var updateExistingItems = function (e, arr) {
				var len = arr.length;
				while (len--) {
					_items[arr[len]].$el.addClass('updated');
					_items[arr[len]].$el.on(_transEndEventNames, handleEvent);
				}
			};

			//  Listeners
			if (_adjust) _$window.on("debouncedresize", handleEvent);
			scope.$on("ng_items_added", checkItemsHaveUpdated);
			scope.$on("ng_items_changed", updateExistingItems);
		}
  };
}]);