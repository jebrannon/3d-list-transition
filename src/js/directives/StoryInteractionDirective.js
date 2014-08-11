var StoryInteractionDirective = function ($window, $timeout) {
	return {
		restrict: 'AE',
		link: function(scope, elem, attrs) {
			var _inactivePeriod = attrs.ngStoryInteractionInactivePeriod ? Number(attrs.ngStoryInteractionInactivePeriod) : 5000;
			var _timer = false;

			//  Methods
			var _handleEvent = function (e, attr) {


				var _eventType = e.type ? e.type : e.name;
				switch(_eventType) {
					case 'mousemove':
						_turnAutoModeOff();
						break;
				}
			};
			var _turnAutoModeOn = function () {

				//  Tell StoryAuto to start playing
				scope.$emit('ng_StoryAuto_play');
			};
			var _turnAutoModeOff = function () {

				//  Tell StoryAuto to pause playback
				scope.$emit('ng_StoryAuto_stop');

				//  Waiting for interaction timer
				_waitingForInteraction();
			};
			var _waitingForInteraction = function () {

				//  Cancel any existing timer
				$timeout.cancel(_timer);

				//  Restart timer
				_timer = $timeout(function () {
					_turnAutoModeOn();
				}, _inactivePeriod);
			};

			//  Listeners
			elem.on('mousemove', _handleEvent);
		}
  };
};
module.exports = StoryInteractionDirective;