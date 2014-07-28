app.directive('ngStoryGlue', ['$window', function($window) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			var _$window = angular.element($window);
			var _rows = attrs.ngStoryGlueRows ? attrs.ngStoryGlueRows : 0;
			var _cols = attrs.ngStoryGlueCols ? attrs.ngStoryGlueCols : 0;
			var _grid = {
				'height': 0,
				'width': 0,
				'y': 0,
				'fixed_apect': 0
			};
			var _items = [];

			//  Methods
			var handleEvent = function (e) {
				var eventType = e.type ? e.type : e.name;
				switch(eventType) {
					case 'debouncedresize':
						adjustGridLayout();
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
				var alignment = attrs.ngStoryGlueAlign;
				var inc = 0;
				var len = _items.length;
				var ratio = 0;

				//  Horizontally aligned list
				if (alignment 
					&& alignment === "horizontal") {

					//  grid height to window height ratio
					if (attrs.ngStoryGlueHeightRatio) {
						ratio = Number(attrs.ngStoryGlueHeightRatio);
					}
					else {
						ratio = 1;
					}

					//  Reset grid width
					_grid.width = 0;

					//  Height and Y position
					_grid.height = Math.ceil(_$window.height() * ratio);
					_grid.y = Math.ceil(_$window.height() * (1-ratio)/2);

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
						if (_items[inc].type === 'large') {
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
			};
			var generateItemsObject = function () {
				var $item = false;
				var $items = attrs.ngStoryGlueClass ? elem.find('.my-list-item') : elem.children();
				var inc = 0;
				var len = $items.length;
				var o = {};
				var ratio = 0;

				//  Update individual item objects and total grid width
				while (len--) {
					$item = $($items[inc]);
					o = {
						type: 'small',
						height: 0,
						width: 0,
						$el: $item
					}
					if ($item.hasClass('large')) {
						o.type = 'large';
					}

					//  Add to items array
					_items.push(o);

					//  Index
					inc++;
				}
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

			//  Init
			generateItemsObject();
			adjustGridLayout();
			if (attrs.ngStoryGlueAdjust) _$window.on("debouncedresize", handleEvent);

		}
  };
}]);