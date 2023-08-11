var resultsPromise,
	citiesPromise,
	favsPromise,
	totalPromise,
	sortVars = ['randomdaily', 'score', 'distance', 'event_dates.start_date'], // event_dates.start_date
	orderVars = ['asc', 'desc'];

// Data source IDs
var RESULTS_DATA = 61;

/*
	$scope.history
	The angular history works by adding an attribute to the results form called "history" and setting it to true.

	It adds a bunch of parameters in the scope to the query string without refreshing the page. Every time it changes,
	it overwrites the current page in browser history. It does not add a page on each change. What this means is that
	upon navigation to a listing or another page after viewing results, going back one page will take you to your
	previous search, but you cannot cycle back through each change you made to the form.

	Majority of this functionality is in this file
 */

/**
 * Results Search
 */
categoryResults.controller('resultsCtrl', function($scope, $http, $compile) {

	$scope.Date = Date;

	var timer,
		mapArray = [];

	// Saved Data in data object
	// Used for non-setting specific data
	$scope.data = {};
	$scope.data.keywords = (getParam('keywords') != '') ? getParam('keywords') : '';
	$scope.data.pageIndex = (getParam('pageIndex') != 0) ? getParam('pageIndex') : 0;
	$scope.data.radius = (getParam('radius') != '') ? getParam('radius') : 0;
	$scope.data.mapTab = (getParam('mapTab') == 'true') ? true : false;
	$scope.data.sortOrder = orderVars[0];
	$scope.data.sort = (getParam('sort') != '' && typeof $scope.data.sort == 'undefined') ? getParam('sort') : sortVars[0];

	$scope.data.locationid = (getParam('location_id') != '') ? getParam('location_id') : (getParam('locationid') != '') ? getParam('locationid') : '';
	$scope.data.region_id = (getParam('region_id') != '') ? getParam('region_id') : '';

	// attrFieldsAtLeast=attrvalue_305&attrFieldsAtLeast=attrvalue_139
	$scope.data.attrFieldsAtLeast = (getParam('attrFieldsAtLeast', true) != '') ? getParam('attrFieldsAtLeast', true) : '';
	$scope.data.attrFieldsAtMost = (getParam('attrFieldsAtMost', true) != '') ? getParam('attrFieldsAtMost', true) : '';

	//$scope.data.pageSize = 20;

	$scope.results = [];

	$scope.map = corpuschristitex.categoryResultsMap;

	$scope.currentDateTime = new Date();
	$scope.currentDate = new Date();
	$scope.currentDate.setHours(0,0,0,0);

	$scope.isLoading = true; //controls the ajax loader, and info display
	$scope.showRadius = false;

	/* Keeps a history of the main sort categories so when they sort by title or whatever this will revert it to the last selected sort type (distance, score, or randomdaily) */
	$scope.sort = sortVars[0];

	if ($scope.data.attrFieldsAtLeast != '') {
		var split = $scope.data.attrFieldsAtLeast.split(',');
		for (var i = 0; i < split.length; i++) {
			var attrField = split[i];
			$scope.data[attrField] = getParam(attrField);
		}
	}

	if ($scope.data.attrFieldsAtMost != "") {
		var split = $scope.data.attrFieldsAtMost.split(',');
		for (var i = 0; i < split.length; i++) {
			var attrField = split[i];
			$scope.data[attrField] = getParam(attrField);
		}
	}

	// CCPW-535 - Translating the DOW string from events
	$scope.translateDow = function(dowStr) {
		if (dowStr == null || dowStr.replace(/\s/g,'') == '') {
			return null;
		}
		var ary = [];
		if (dowStr.indexOf("U") != -1) {
			ary.push("Sunday");
		}
		if (dowStr.indexOf("M") != -1) {
			ary.push("Monday");
		}
		if (dowStr.indexOf("T") != -1) {
			ary.push("Tuesday");
		}
		if (dowStr.indexOf("W") != -1) {
			ary.push("Wednesday");
		}
		if (dowStr.indexOf("R") != -1) {
			ary.push("Thursday");
		}
		if (dowStr.indexOf("F") != -1) {
			ary.push("Friday");
		}
		if (dowStr.indexOf("S") != -1) {
			ary.push("Saturday");
		}

		var str = ary.join(", ");
		if (ary.length > 2) {
			str = str.replace(/,([^,]*)$/,', and'+'$1');
		} else if (ary.length == 2) {
			str = str.replace(/,([^,]*)$/,' and'+'$1');
		}
		return str;
	}

	$scope.translateTimes = function(startTime, endTime) {
		var hasStart = startTime != null && startTime.replace(/\s/g, '') != '';
		var hasEnd = endTime != null && endTime.replace(/\s/g, '') != '';

		if (hasStart && hasEnd) {
			return startTime + ' to ' + endTime;
		} else if (hasStart) {
			return 'Starting at ' + startTime;
		} else if (hasEnd) {
			return 'Ending at ' + endTime;
		}
		return "All Day";
	}

	$scope.data.discounttypeid = (getParam('discounttypeid') != '') ? getParam('discounttypeid') : [];
	$scope.preloadedClassifs = getParam('class_id');
	$scope.preloadedAmenities = getParam('attr_id');
	$scope.preloadedRegions = getParam('region_id');
	$scope.data.startDate = (getParam('startDate') != '') ? getParam('startDate') : false;
	$scope.data.endDate = (typeof getParam('endDate') != 'undefined' || getParam('endDate') != '') ? getParam('endDate') : '';

	/* city check if it gets completely removed */
	$scope.$watch('city', function(newVal, oldVal){
		if(newVal == '' && newVal != oldVal){
			$scope.data.city = '';
			$scope.data.radius = 0;
			$scope.data.locationid = '';
			$scope.data.regionid = '';
			if($scope.data.keywords == '' && getParam('sort') != 'ratings' && getParam('sort') != 'dealstatus' && getParam('sort') != 'event_start_date' && getParam('sort') != 'title' && getParam('sort')){
				$scope.data.sort = sortVars[0];
				$scope.data.sortOrder = orderVars[0];
			}else if(getParam('sort') != 'ratings' && getParam('sort') != 'dealstatus' && getParam('sort') != 'event_start_date' && getParam('sort') != 'title' && getParam('sort')){
				$scope.data.sort = sortVars[1];
				$scope.data.sortOrder = orderVars[1];
			}
		}
	})

	$scope.$watch('data.sort', function(newVal, oldVal){
		if($scope.data.sort != 'ratings' && $scope.data.sort != 'dealstatus' && $scope.data.sort != 'event_start_date' && $scope.data.sort != 'title' && $scope.data.sort){
			$scope.sort = $scope.data.sort;
		}
	});

	/* basically just watching for the end date to be blank, if it's blank I just remove it from the query string */
	$scope.$watch('data.endDate', function(newVal, oldVal){
		if(newVal == ''){
			// I had no idea this works. but this just "deletes" it from the params object.
			delete $scope.data.endDate;
		}
	});

	$scope.mapBtnClick = function(){
		if(!$scope.data.mapTab){
			$scope.data.mapTab = true;
		}
	}

	$scope.listBtnClick = function(){
		if($scope.data.mapTab){
			$scope.data.mapTab = false;
		}
	}

	/*
		This function will be called anytime 'data' changes.
		http://docs.angularjs.org/api/ng/type/$rootScope.Scope#$watch
	*/
	$scope.$watch('data', function(newVal, oldVal) {

		if ($scope.data.endDate == ''){
			return;
		}

		if ((typeof $scope.data.city != 'undefined' && $scope.data.city != '' && $scope.data.radius == 0) || (typeof $scope.data.city != 'undefined' && $scope.data.city != '')) {
			$scope.showRadius = true;
		} else {
			$scope.showRadius = false;
		}

		if (!$scope.data.sort) {
			$scope.data.sort = $scope.sort;
		}

		if ($scope.data.sort != 'ratings' && $scope.data.sort != 'dealstatus' && $scope.data.sort != 'event_start_date' && $scope.data.sort != 'title' && $scope.data.sort) {
			if ($scope.data.keywords != '') {
				$scope.data.sort = sortVars[1];
			} else if (!$scope.data.sort) {
				$scope.data.sort = $scope.sort;
			} else if ($scope.data.type === 'reitevents') {
				$scope.data.sort = sortVars[3]; // if this is the events section add the sort variable event_dates.start_date
			} else if ($scope.listingResult != 'true') {
				$scope.data.sort = sortVars[0];
			}
		}
		//this is for the type filter on the discounts search.
		if ($scope.data.discounttypeid != '') {
			$scope.data.attrFieldsOr = 'discounttypeid';
			$scope.data.attrFields = 'region_id';
		} else if ($scope.data.regionid != '') {
			$scope.data.attrFieldsOr = 'class_id,region_id';
		} else {
			$scope.data.attrFieldsOr = '';
		}

		// if region_id is passed, we need to make sure we also pass the 'attrFields' value to tell the API
		// if ($scope.data.regionid != '') {
		// 	//$scope.data.attrFields='region_id';
		// 	$scope.data.attrFieldsOr = 'class_id,region_id';
		// }

		// if it's events or discounts this sets the startDate to todays date.
		if ($scope.data.type != "reitlistings" && !$scope.data.startDate) {
			var today = new Date(),
				month = today.getMonth() + 1,
				day = today.getDate(),
				dateString = '';
				month = (month >= 10) ? month : '0' + month;
				day = (day >= 10) ? day : '0' + day;
				dateString = month + '/' + day + '/' + today.getFullYear();
			$scope.data.startDate = dateString;
		}

		//checks to see if the new and old data are different, but the page index is the same. This tells me its a fresh query.
		if(
			(($.isArray(newVal.attr_id)) ? newVal.attr_id.join(',') : newVal.attr_id) != (($.isArray(oldVal.attr_id)) ? oldVal.attr_id.join(',') : oldVal.attr_id) ||
			newVal.city != oldVal.city ||
			(($.isArray(newVal.class_id)) ? newVal.class_id.join(',') : newVal.class_id) != (($.isArray(oldVal.class_id)) ? oldVal.class_id.join(',') : oldVal.class_id) ||
			(($.isArray(newVal.region_id)) ? newVal.region_id.join(',') : newVal.region_id) != (($.isArray(oldVal.region_id)) ? oldVal.region_id.join(',') : oldVal.region_id) ||
			newVal.keywords != oldVal.keywords ||
			newVal.sort != oldVal.sort ||
			newVal.radius != oldVal.radius
		){
			$scope.data.pageIndex = 0;
		}

		var params = $.param($scope.data);
		resultsPromise = $.Deferred();

		// Decodes the param data and manually removes the square brackets with regular expressions
		params = decodeURIComponent(params).replace(/[\[\]]+/g,'');
		if(newVal != oldVal && $scope.history && Modernizr.history){
			 /*
			 Replacing history with keywords=&pageIndex=0&radius=0&mapTab=false&sortOrder=asc&sort=randomdaily&locationid=&region_id=&attrFieldsAtLeast=attrvalue_305&startDate=false&class_id=1,2,154&attr_id=301,305&lat=&lon=&city=&pageSize=20&type=reitlistings&attrFieldsOr=&
			 attrFields=region_id&attrvalue_305=123
			 */
			history.replaceState(null, 'results', '?'+params);
		}

		/* I needed the map button in the query string, but didn't want it to refresh the results set each time you switched views */
		if(
			(($.isArray(newVal.attr_id)) ? newVal.attr_id.join(',') : newVal.attr_id) == (($.isArray(oldVal.attr_id)) ? oldVal.attr_id.join(',') : oldVal.attr_id) &&
			newVal.city == oldVal.city &&
			(($.isArray(newVal.class_id)) ? newVal.class_id.join(',') : newVal.class_id) == (($.isArray(oldVal.class_id)) ? oldVal.class_id.join(',') : oldVal.class_id) &&
			newVal.keywords == oldVal.keywords &&
			newVal.sort == oldVal.sort &&
			newVal.radius == oldVal.radius &&
			newVal.mapTab != oldVal.mapTab
		){
			return;
		}
		$scope.isLoading = true;
		//and re-encoding it
		params = '&'+params;
		$scope.query = params;
		BREI.debug.query = params;

		//console.log(params);

		// just incase this is initiated but something changes, this resets it.
		clearTimeout(timer);

		timer = setTimeout(function () {
			$scope.query = params;
			$http.get(BREI.URL + 'GetJsonData.ashx?id=' + RESULTS_DATA + params).success(function(data){
				resultsPromise.resolve(data);
			});
			resultsPromise.done(function (data) {

				BREI.searchResultIndex = 0;

				$scope.totalResults = data.hits.total;
				$scope.results = data.hits.hits;
				$scope.isLoading = false;
				$scope.map.removePins();
			});
		}, 800);
	}, true);

	//"&keywords=&type=&sort=title&sortOrder=asc&attrFields=&attr_id=&class_sourceid=
	//$http.get('GetJsonData.ashx?id=59&keywords=&type=&sort=title&sortOrder=asc&attrFields=&attr_id=&class_sourceid=')
});

/**
 * Site Search
 */
categoryResults.controller('searchCtrl', function($scope, $http){
	var timer;

	$scope.isLoading = true; //controls the ajax loader, and info display

	$scope.data = {};
	$scope.data.keywords = (typeof getParam('keywords') != 'undefined') ? getParam('keywords') : '';
	$scope.data.type = (getParam('type') != '') ? getParam('type').split(',') : [];
	$scope.data.categoryId = [];
	$scope.data.locationCategoryId = [];
	$scope.data.pageSize = 20;
	$scope.data.pageIndex = 0;
	$scope.data.keepCatsSeparate = "true";

	$scope.results = [];
	resultsPromise = $.Deferred();
	$scope.totalResults;
	//$scope.favorites = [];
	$scope.$watch('data', function(newVal, oldVal){

		console.log('scope watched');
console.log($scope.data.categoryId);
		var sort = "sort=title";

		if($scope.data.categoryId[0] == $scope.origId && $scope.data.categoryId.length > 1){
			$scope.data.categoryId.splice(0, 1);
		}else if($scope.data.categoryId.length == 0){
			$scope.data.categoryId = [$scope.origId];
		}

		// CCPW-597 - Sort Trip Ideas on the custom date field.
		// CCPW-672 - Adding reference categories for where this should happen.
		var catSortRef = [
			"9",
			"238",
			"155",
			"157",
			"151",
			"150",
			"74",
			"241",
			"239",
			"237",
			"158",
			"153",
			"240"
		]

		if ($scope.data.categoryId.length == 1 && catSortRef.indexOf($scope.data.categoryId[0]) !== "-1" && $scope.data.keywords == '') {
			sort = "sortField=customfield_Date&forceSortField=1&sortReverse=true";
		}

		if(newVal.keywords != oldVal.keywords ||
			newVal.type.join(',') != oldVal.type.join(',')
		){
			$scope.data.pageIndex = 0;
		}


		var g2catParams = '';
		var removedCat9 = false;
		if ($scope.data.locationCategoryId.length > 0) {
			g2catParams = '&group2categoryId=' + $scope.data.locationCategoryId.join(',');
		}

		if ($scope.data.categoryId.length > 1) {
			console.log('removing 9');
			var index = $scope.data.categoryId.indexOf("9");
			$scope.data.categoryId.splice(index, 1);
			removedCat9 = true;
		}

		var params = $.param(newVal);
		$scope.isLoading = true;
		resultsPromise = $.Deferred();


		//this made me so mad. I'm just decoding it and removing the array brackets.
		params = decodeURIComponent(params).replace(/[\[\]']+/g,'');
		if(newVal != oldVal && $scope.history && Modernizr.history){
			history.replaceState(null, 'searchResults', '?'+params);
		}
		//and re-encoding it
		params = '&'+params+'&'+sort + g2catParams;

		if (removedCat9) {
			$scope.data.categoryId.push("9");
		}

		$scope.query = params;
		BREI.debug.query = params;

		clearTimeout(timer);
		timer = setTimeout(function(){

			$http.get(BREI.URL + 'GetJsonData.ashx?id=2'+params).success(function(data){
				resultsPromise.resolve(data);
			});
			resultsPromise.done(function(data){
				BREI.searchResultIndex = 0;
				getTotalAttrResults('recordCount', data.siteMap.Parameters.Parameter); // grabs the total results from the attrs object. This is also done using promise.
				totalPromise.done(function(count){
					$scope.totalResults = (count*1);
				})
				$scope.isLoading = false;
				if(data.siteMap != null && typeof data.siteMap.siteMapNode != 'undefined'){
					$scope.results = ($.isArray(data.siteMap.siteMapNode)) ? data.siteMap.siteMapNode : new Array(data.siteMap.siteMapNode);
				}else{
					$scope.results.length = 0;
					$scope.totalResults = 0;
				}
			});
		}, 800)
	}, true);
})

/**
 * Travel Ideas
 */
categoryResults.controller('travelIdeasCtrl', function($scope, $http){

	var timer;

	$scope.isLoading = true;
	$scope.data = {};
	$scope.results = [];
	$scope.data.pageSize = 20;
	$scope.data.pageIndex = 0;
	//$scope.favorites = [];
	//$scope.data.categoryId = (getParam('id') != '' || getParam('categoryId') != '') ? getParam('id') || getParam('categoryId') : 18;

	$scope.data.categoryId = (getParam('categoryId') != '' && getParam('id') == '') ? getParam('categoryId') : $scope.data.categoryId;
	$scope.data.keywords = (getParam('keywords') != '') ? getParam('keywords') : '';

	var params = $.param($scope.data);
	resultsPromise = $.Deferred();

	$scope.$watch('data', function(newVal, oldVal){
		var params = $.param(newVal);
		params = decodeURIComponent(params).replace(/[\[\]]+/g,'');
		$scope.isLoading = true;
		if($scope.history && Modernizr.history){
			history.replaceState(null, 'results', '?'+params);
		}
		resultsPromise = $.Deferred();
		BREI.debug.query = newVal;

		clearTimeout(timer);
		timer = setTimeout(function(){
			$http.get(BREI.URL + 'GetJsonData.ashx?id=2&'+params).success(function(data){
				resultsPromise.resolve(data);
			});

			resultsPromise.done(function(data){
				$scope.isLoading = false;

				getTotalAttrResults('recordCount', data.siteMap.Parameters.Parameter); // grabs the total results from the attrs object. This is also done using promise.
				totalPromise.done(function(count){
					$scope.totalResults = (count*1);
				})

				$scope.results = (!$.isArray(data.siteMap.siteMapNode)) ? new Array(data.siteMap.siteMapNode) : data.siteMap.siteMapNode;
				// console.log(data.ArrayOfPage.Page[0].Elements.PageElement[1].CDATAMarkup['#cdata-section']);
			})
		}, 800)
	}, true)
});


function success(data){
	resultsPromise.resolve(data);
}

function searchResultsSuccess(data){
	resultsPromise.resolve(data);
}
// function favorites(data){
// 	favsPromise.resolve(data);
// }

function getTotalAttrResults(name, arr){
	totalPromise = $.Deferred();
	$.each(arr, function(i){
		if(arr[i]['attrkey'] == name){
			totalPromise.resolve(arr[i]['attrvalue']);
		}
	});
}
