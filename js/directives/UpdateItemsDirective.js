app.directive('myDirective', ['$window', function($window) {
	var template = '<div class="">' +
        '<h1>{{ data.name }}</h1>' +
        '</div>';
	return {
            template: template,
            scope: {
                data: '='
            },
            link: function (scope, element, attrs) {

            }
  };
}]);