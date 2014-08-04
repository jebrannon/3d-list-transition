app.directive('ngStoryAuto', ['$window', '$timeout', function($window, $timeout) {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			var _interval = attrs.ngStoryAutoInterval ? Number(attrs.ngStoryAutoInterval) : 2000;
			var _speed = attrs.ngStoryAutoSpeed ? Number(attrs.ngStoryAutoSpeed) : 2000;
			var _wait = attrs.ngStoryAutoWait ? Number(attrs.ngStoryAutoWait) : 4000;
			var _timer = false;
			var _now = 0;
			var _limit = scope.order.length;
			var _$item = false;
			var _$body = scope.isIE ? $('html') : $('body');   //  This needs to be HTML for IE


			//  Methods
			var _handleEvent = function (e, attr) {
				var eventType = e.type ? e.type : e.name;
				switch(eventType) {
					case 'ng_StoryGlue_ready':
					case 'ng_StoryAuto_play':
						// _playStorySequence();
						break;
					case 'ng_StoryAuto_stop':
						_stopStorySequence();
						break;
				}
			};
			var _playStorySequence = function () {

				//  Close any story items already open
				scope.$emit('ng_StoryItem_close');

				//  Initiate new Item
				_timer = $timeout(function () {
					_moveToStoryItem(_now)
				}, _interval);

				//  Increment array index
				_now++;

				//  Reset once limit reached
				if (_now === _limit) {
					_now = 0;
				}
			};
			var _moveToStoryItem = function (index) {

				//  Define current target item
				_$item = elem.find('#' + scope.order[index].id);

				//  Calculate offset
				var _offset = _$item.position().left;

				//  Scroll to the item
				_$body.animate({scrollLeft: _offset}, _speed, _openStoryItem);
			};
			var _openStoryItem = function () {

				//  Transmit selection to StoryItem directive
				scope.$emit('ng_StoryItem_select', _$item);

				//  After the item has been open for specified period of time, close it.
				_timer = $timeout(function () {
					_closeStoryItem();
				}, _wait);
			};
			var _closeStoryItem = function () {
				
				//  
				scope.$emit('ng_StoryItem_close', _$item);
			};
			var _stopStorySequence = function () {

				//  Cancel the open story timer
				$timeout.cancel(_timer);

				//  Cancel any animation happening
				_$body.stop();
			};

			//  Listeners
			scope.$on('ng_StoryGlue_ready', _handleEvent);
			scope.$on('ng_StoryAuto_play', _handleEvent);
			scope.$on('ng_StoryAuto_stop', _handleEvent);
		}
  };
}]);