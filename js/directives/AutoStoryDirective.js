app.directive('ngAutoStory', ['$window', '$timeout', function($window, $timeout) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			var _interval = attrs.ngAutoStoryInterval ? Number(attrs.ngAutoStoryInterval) : 3000;
			var _wait = _interval * 2;
			var _timer = false;
			var _inited = false;
			var _animating = false;
			var _now = 0;
			var _limit = scope.order.length;
			var $_item = false;

			//  Methods
			var handleEvent = function (e, attr) {
				var eventType = e.type ? e.type : e.name;
				switch(eventType) {
					case 'items_ready':
						initAutoStorySequence();
						break;
				}
			};
			var initAutoStorySequence = function () {

				//  
				_timer = $timeout(function () {
					moveToStoryItem()
				}, _interval);

				//  
				_now++;
				if (_now === _limit) {
					_now = 0;
				}
			};
			var findElementFromOrderArray = function () {
				// console.log('findElementByFromOrderArray', elem.find('#' + scope.order[_now].id) );
				$_item = elem.find('#' + scope.order[_now].id);
			};
			var moveToStoryItem = function () {
				findElementFromOrderArray(_now);
				var offset = $_item.position().left;
				$('html, body').animate({scrollLeft: offset}, _interval, openStoryItem);
			};
			var openStoryItem = function () {
				scope.$emit('select_item', $_item);
				_timer = $timeout(function () {
					closeStoryItem();
				}, _wait);
			};
			var closeStoryItem = function () {
				scope.$emit('close_item', $_item);
			};

			//  Listeners
			scope.$on('items_ready', handleEvent);
			scope.$on('item_closed', initAutoStorySequence);
		}
  };
}]);