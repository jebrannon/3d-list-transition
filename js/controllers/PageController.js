app.controller("pageController", function ($scope, $window, $timeout) {
	var updateMemory = false;
	$scope.items = [
		{
			className: 'flat',
			title: '1'
		},
		{
			className: 'media',
			title: '2'
		},
		{
			className: 'media',
			title: '3'
		},
		{
			className: 'flat',
			title: '4'
		},
		{
			className: 'flat',
			title: '5'
		},
		{
			className: 'media',
			title: '6'
		},
		{
			className: 'flat',
			title: '7'
		},
		{
			className: 'flat',
			title: '8'
		},
		{
			className: 'media',
			title: '9'
		},
		{
			className: 'flat',
			title: '10'
		},
		{
			className: 'flat',
			title: '11'
		},
		{
			className: 'media',
			title: '12'
		},
		{
			className: 'media',
			title: '13'
		},
		{
			className: 'media',
			title: '14'
		},
		{
			className: 'flat',
			title: '15'
		},
		{
			className: 'flat',
			title: '16'
		},
		{
			className: 'media',
			title: '17'
		},
		{
			className: 'flat',
			title: '18'
		},
		{
			className: 'flat',
			title: '19'
		},
		{
			className: 'media',
			title: '20'
		},
		{
			className: 'flat',
			title: '21'
		},
		{
			className: 'flat',
			title: '22'
		},
		{
			className: 'media',
			title: '23'
		},
		{
			className: 'flat',
			title: '24'
		},
		{
			className: 'flat',
			title: '25'
		},
		{
			className: 'media',
			title: '26'
		},
		{
			className: 'media',
			title: '27'
		},
		{
			className: 'media',
			title: '28'
		},
		{
			className: 'flat',
			title: '29'
		},
		{
			className: 'flat',
			title: '30'
		},
		{
			className: 'media',
			title: '31'
		},
		{
			className: 'flat',
			title: '32'
		},
		{
			className: 'flat',
			title: '33'
		},
		{
			className: 'media',
			title: '34'
		},
		{
			className: 'flat',
			title: '35'
		},
		{
			className: 'flat',
			title: '36'
		},
		{
			className: 'media',
			title: '37'
		}
	];

	$scope.$watch('items', function (data) {
		if (updateMemory) {
			$scope.$broadcast('items_changed', updateMemory);
			updateMemory = false;
		}
		else {
			$scope.$broadcast('items_added', data);
		}
  }, true);

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
 //  }, 1000);

 //  $timeout(function() {
 //  	// updateMemory = [3,6,8];

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