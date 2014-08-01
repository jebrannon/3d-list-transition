app.controller("pageController", function ($scope, $window, $timeout) {
	var updateMemory = false;
	var sampleData = [
		{
			id: 'd01',
			className: 'flat',
			title: '1'
		},
		{
			id: 'd02',
			className: 'media',
			title: '2'
		},
		{
			id: 'd03',
			className: 'media',
			title: '3'
		},
		{
			id: 'd04',
			className: 'flat',
			title: '4'
		},
		{
			id: 'd05',
			className: 'flat',
			title: '5'
		},
		{
			id: 'd06',
			className: 'media',
			title: '6'
		},
		{
			id: 'd07',
			className: 'flat',
			title: '7'
		},
		{
			id: 'd08',
			className: 'flat',
			title: '8'
		},
		{
			id: 'd09',
			className: 'media',
			title: '9'
		},
		{
			id: 'd10',
			className: 'flat',
			title: '10'
		},
		{
			id: 'd11',
			className: 'flat',
			title: '11'
		},
		{
			id: 'd12',
			className: 'media',
			title: '12'
		},
		{
			id: 'd13',
			className: 'media',
			title: '13'
		},
		{
			id: 'd14',
			className: 'media',
			title: '14'
		},
		{
			id: 'd15',
			className: 'flat',
			title: '15'
		},
		{
			id: 'd16',
			className: 'flat',
			title: '16'
		},
		{
			id: 'd17',
			className: 'media',
			title: '17'
		},
		{
			id: 'd18',
			className: 'flat',
			title: '18'
		},
		{
			id: 'd19',
			className: 'flat',
			title: '19'
		},
		{
			id: 'd20',
			className: 'media',
			title: '20'
		},
		{
			id: 'd21',
			className: 'flat',
			title: '21'
		},
		{
			id: 'd22',
			className: 'flat',
			title: '22'
		},
		{
			id: 'd23',
			className: 'media',
			title: '23'
		},
		{
			id: 'd24',
			className: 'flat',
			title: '24'
		},
		{
			id: 'd25',
			className: 'flat',
			title: '25'
		},
		{
			id: 'd26',
			className: 'media',
			title: '26'
		},
		{
			id: 'd27',
			className: 'media',
			title: '27'
		},
		{
			id: 'd28',
			className: 'media',
			title: '28'
		},
		{
			id: 'd29',
			className: 'flat',
			title: '29'
		},
		{
			id: 'd30',
			className: 'flat',
			title: '30'
		},
		{
			id: 'd31',
			className: 'media',
			title: '31'
		},
		{
			id: 'd32',
			className: 'flat',
			title: '32'
		},
		{
			id: 'd33',
			className: 'flat',
			title: '33'
		},
		{
			id: 'd34',
			className: 'media',
			title: '34'
		},
		{
			id: 'd35',
			className: 'flat',
			title: '35'
		},
		{
			id: 'd36',
			className: 'flat',
			title: '36'
		},
		{
			id: 'd37',
			className: 'media',
			title: '37'
		}
	];
	var shuffleArray = function (array) {
		/**
		 * Using Fisher-Yates shuffle algorithm.
		 */
		var _clone = array.slice();
		for (var i = _clone.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = _clone[i];
			_clone[i] = _clone[j];
			_clone[j] = temp;
		}
		return _clone;
	};

	//  Within scope
	$scope.isIE = (navigator.userAgent.indexOf("MSIE") != -1 || navigator.appVersion.indexOf('Trident/') > 0);
	$scope.auto = true;
	$scope.items = shuffleArray(sampleData);
	$scope.order = sampleData;
	$scope.$watch('items', function (data) {
		if (updateMemory) {
			$scope.$broadcast('ng_StoryGlue_update', updateMemory);
			updateMemory = false;
		}
		else {
			$scope.$broadcast('ng_StoryGlue_inject', data);
		}
  }, true);
  $scope.$on('ng_StoryAuto_stop', function () {
  	$scope.auto = false;
  });
  $scope.$on('ng_StoryAuto_play', function () {
  	$scope.auto = true;
  });

  
  //  Temporary
	// $timeout(function() {
 //  	$scope.items.push(
 //  	{
	// 		className: 'media',
	// 		title: '38'
	// 	},
	// 	{
	// 		className: 'media',
	// 		title: '39'
	// 	},
	// 	{
	// 		className: 'flat',
	// 		title: '40'
	// 	},
	// 	{
	// 		className: 'flat',
	// 		title: '41'
	// 	},
	// 	{
	// 		className: 'media',
	// 		title: '42'
	// 	},
	// 	{
	// 		className: 'media',
	// 		title: '43'
	// 	},
	// 	{
	// 		className: 'flat',
	// 		title: '44'
	// 	},
	// 	{
	// 		className: 'flat',
	// 		title: '45'
	// 	},
	// 	{
	// 		className: 'media',
	// 		title: '46'
	// 	},
	// 	{
	// 		className: 'flat',
	// 		title: '47'
	// 	},
	// 	{
	// 		className: 'flat',
	// 		title: '48'
	// 	},
	// 	{
	// 		className: 'media',
	// 		title: '49'
	// 	},
	// 	{
	// 		className: 'media',
	// 		title: '50'
	// 	},
	// 	{
	// 		className: 'flat',
	// 		title: '51'
	// 	},
	// 	{
	// 		className: 'flat',
	// 		title: '52'
	// 	})
 //  }, 2000);

 //  $timeout(function() {

 //  	$timeout(function() {
 //  		$scope.items[3].title = 'Story';
 //  		updateMemory = [3];
 //  	}, 100);

 //  	$timeout(function() {
 //  		$scope.items[6].title = 'Stream';
 //  		updateMemory = [6];
 //   	}, 300);

 //  	$timeout(function() {
 //  		$scope.items[8].title = 'Striders';
 //  		updateMemory = [8];
 //  	}, 500);
 //  }, 3000);
});