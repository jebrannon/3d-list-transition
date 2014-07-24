app.service('LoadDataService', function($http, $timeout) {
	var _this = this;
	this.page = 1;
	this.limit = 10;
	this.dataSet = [{name: 'Darnell'},{name: 'Jesica'},{name: 'Derrick'},{name: 'Kori'},{name: 'Kiana'},{name: 'Bruno'},{name: 'Adolfo'},{name: 'Francisca'},{name: 'Shanta'},{name: 'Lamonica'},{name: 'Tameka'},{name: 'Tressa'},{name: 'Arie'},{name: 'Diann'},{name: 'Marcos'},{name: 'Machelle'},{name: 'Dinah'},{name: 'Chantelle'},{name: 'Bertie'},{name: 'Delcie'},{name: 'Corinna'},{name: 'Yuonne'},{name: 'Tynisha'},{name: 'Katy'},{name: 'Gregoria'},{name: 'Johnathon'},{name: 'Mose'},{name: 'Christiana'},{name: 'Penni'},{name: 'Mitchell'},{name: 'Bethel'},{name: 'Joanie'},{name: 'Modesto'},{name: 'Stephen'},{name: 'Rex'},{name: 'Morton'},{name: 'Merrilee'},{name: 'Mildred'},{name: 'Shaunna'},{name: 'Eura'},{name: 'Rosalee'},{name: 'Lou'},{name: 'Sherwood'},{name: 'Glady'},{name: 'Ryan'},{name: 'Lisette'},{name: 'Wilmer'},{name: 'Bert'},{name: 'Giovanna'},{name: 'Elisa'}];
	this.data = [{name: 'Darnell'},{name: 'Jesica'},{name: 'Derrick'},{name: 'Kori'},{name: 'Kiana'},{name: 'Bruno'},{name: 'Adolfo'},{name: 'Francisca'},{name: 'Shanta'},{name: 'Lamonica'}];
	
	this.fetchContent = function () {

		// this.page = this.page + 1;
		$timeout(function() {
			_this.data = _this.getDataRange();
		}, 3000);
	};

	this.getDataRange = function () {
		var start = this.limit * this.page;
		var end = this.limit * (this.page + 1);
		var arr = []
		for (var i = start; i < end; i++) {
			arr.push(this.dataSet[i]);
		}
		return arr;
	};
});