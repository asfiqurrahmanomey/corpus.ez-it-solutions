var categoryResults = angular.module('corpusResultsApp', []);

/*
	restrict params:
	'A' - only matches attribute name
	'E' - only matches element name
	'C' - only matches class name

	Directive name:
		- camel case = - in the markup
			ex: classifsCheckbox = classifs-checkbox
 */

/*
	$scope.history
	The angular history works by adding an attribute to the results form called "history" and setting it to true.

	It adds a bunch of parameters in the scope to the query string without refreshing the page. Every time it changes,
	it overwrites the current page in browser history. It does not add a page on each change. What this means is that
	upon navigation to a listing or another page after viewing results, going back one page will take you to your
	previous search, but you cannot cycle back through each change you made to the form.

	Majority of this functionality is in results.angular.controller.js
 */

var BREI = {
	searchResultIndex: 0,
	debug: {
		query: ''
	},
	URL: '/'	// live
	//URL: 'http://wwwstaging-corpus-qa1.ec2.breilabs.com/',	// debug
	//favorites: false,	// true to enable loading of favorites
	//favoritesTransformationID: 18
},
// homeLayer = typeof(Microsoft) != 'undefined' ? new Microsoft.Maps.EntityCollection({zIndex: 1}) : 'undefined',
infoBoxHtml = [];


/**
 * Search Form Checkboxes
 */
categoryResults.directive('classifsCheckbox', function () {
	return {
		restrict: 'A',
		link: function (scope, elem, attrs) {


			// Check if classification IDs are already specified in the query string (due to history or preconfigured links)
			// and check the appropriate boxes if any are found
			//
			var preloadedClassifs = [scope.preloadedClassifs];
			if(scope.preloadedClassifs.indexOf(',')) {
				preloadedClassifs = scope.preloadedClassifs.split(',');
			}

			if(elem.val().indexOf(',') != -1) {
				var splitVal = elem.val().split(',');
				$.each(splitVal, function(i){
					if(preloadedClassifs.indexOf(splitVal[i]) != -1){
						elem.prop('checked', true);
						elem.next('label').addClass('checked');
					}
				})
			} else {
				if(preloadedClassifs.indexOf(elem.val()) != -1) {
					//turns out to check a "custom" checkbox yu need to add a class to the label. That's what next() is looking for.
					elem.prop('checked', true);
					elem.next('label').addClass('checked');
				}
			}
			// if(scope.preloadedClassifs && scope.preloadedClassifs.indexOf(elem.val()) != -1) {
			// 	//turns out to check a "custom" checkbox yu need to add a class to the label. That's what next() is looking for.
			// 	elem.next().addClass('checked');
			// }

			elem.on('change', function(){

				var checked = $(this).is(':checked'),
					val = $(this).val();

				if(!$.isArray(scope.data.class_id)){
					scope.data.class_id = scope.data.class_id.split(',');
				}
				if(checked){
					if(scope.parentID.indexOf(',') != -1){
						if(scope.parentID == scope.data.class_id.join(',')){
							scope.data.class_id = [];
						}
					}else{
						if(scope.data.class_id.indexOf(scope.parentID) != -1){
							scope.data.class_id = [];
						}
					}
					if(val.indexOf(',') != -1){
						var splitVal = val.split(',');
						$.each(splitVal, function(i){
							if(scope.data.class_id.indexOf(splitVal[i]) == -1){
								scope.data.class_id.push(splitVal[i]);
							}
						})
					}else{
						scope.data.class_id.push(val);
					}
				}else{
					if(val.indexOf(',') != -1){
						var splitVal = val.split(',');
						$.each(splitVal, function(i){
							if(scope.data.class_id.indexOf(splitVal[i]) != -1){
								var index = scope.data.class_id.indexOf(splitVal[i]);

								scope.data.class_id.splice(index, 1);
							}
						})
					}else{
						if(scope.data.class_id.indexOf(val) != -1){
							var index = scope.data.class_id.indexOf(val);

							scope.data.class_id.splice(index, 1)
						}
					}

					if(scope.data.class_id.length == 0){
						scope.data.class_id.push(scope.parentID)
					}
				}
				if(scope.data.class_id.length > 1){
					scope.data.class_id = scope.data.class_id.join(',');
				}else{
					scope.data.class_id = scope.data.class_id;
				}
				// if(checked){
				// 	if(scope.data.class_id.indexOf(scope.parentID) != -1){
				// 		scope.data.class_id = [];
				// 	}
				// 	scope.data.class_id.push(val);
				// }else{
				// 	if(scope.data.class_id.indexOf(val) != -1){
				// 		var index = scope.data.class_id.indexOf(val);

				// 		scope.data.class_id.splice(index, 1)
				// 	}
				// 	if(scope.data.class_id.length == 0){
				// 		scope.data.class_id = [scope.parentID];
				// 	}
				// }

				scope.$apply(); //very important. This triggers an up in the controller
			})
		}
	}
});

/**
 * Amenities
 */
categoryResults.directive('amensCheckbox', function(){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			//checks to make sure that there is a query string for the classifs, then if the element value matches whats in the query string it checks it.

			if (scope.preloadedAmenities.indexOf(',')) {
				var preloadedAmenities = scope.preloadedAmenities.split(',');
			} else {
				var preloadedAmenities = [scope.preloadedAmenities];
			}

			if (elem.val().indexOf(',') != -1) {
				var splitVal = elem.val().split(',');
				$.each(splitVal, function(i) {
					if (preloadedAmenities.indexOf(splitVal[i]) != -1) {
						elem.prop('checked', true);
						elem.next().addClass('checked');
					}
				});
			} else {
				if (preloadedAmenities.indexOf(elem.val()) != -1) {
					//turns out to check a "custom" checkbox yu need to add a class to the label. That's what next() is looking for.
					elem.prop('checked', true);
					elem.next().addClass('checked');
				}
			}

			elem.on('change', function(){
				var checked = $(this).is(':checked'),
					val = $(this).val();

				if(!$.isArray(scope.data.attr_id)){
					scope.data.attr_id = scope.data.attr_id.split(',');
				}

				// we have to initialize these variables as arrays before we can push stuff to it
				if (!$.isArray(scope.data.attrFieldsAtLeast)) {
					scope.data.attrFieldsAtLeast = [];
				}
				if (!$.isArray(scope.data.attrFieldsAtMost)) {
					scope.data.attrFieldsAtMost = [];
				}

				// show/hide textbox depending on checkbox state
				var numericInput = $(this).parent().find('.numeric-field input'); // the textbox
				var isNumericCheckbox = (numericInput.length == 1); // is this amenity a numeric?
				var numericArea = $(this).parent().find('.numeric-field'); // the div around the textbox

				// Check if it's an at most or at least field
				var isAtLeast = $(this).parent().find('.numeric-field').hasClass('at-least');
				var isAtMost = $(this).parent().find('.numeric-field').hasClass('at-most');

				if(checked){

					if(val.indexOf(',') != -1){
						$.each(splitVal, function(i){
							if(scope.data.attr_id.indexOf(splitVal[i]) == -1){
								scope.data.attr_id.push(splitVal[i]);
							}
						})
					}else{
						scope.data.attr_id.push(val);
					}

					// Handles numeric fields
					if (isNumericCheckbox) { // If there is a numeric min/max field value...
						var numericVal = parseInt(numericInput.val()); // Get the value from the numeric field
						var attrValue = 'attrvalue_' + val; // This is the key for the numeric field

						if (isAtLeast) { // If at least, push least format
							scope.data.attrFieldsAtLeast.push(attrValue);
						} else if (isAtMost) { // Otherwise, push most format
							scope.data.attrFieldsAtMost.push(attrValue);
						}

						/**
						 * Note: The textbox has an associated ng-model attribute, so changes to it will
						 * automatically cause the form to post.
						 */
					}

				} else {

					numericInput.val('');

					// pop it from the array on uncheck
					if (isNumericCheckbox) {

						// var attrValue = 'attrvalue_' + val;
						// if (isAtLeast) { // If at least, push least format
						// 	scope.data.attrFieldsAtLeast.pop(attrValue);
						// } else if (isAtMost) { // Otherwise, push most format
						// 	scope.data.attrFieldsAtMost.pop(attrValue);
						// }

						var attrValue = 'attrvalue_' + val;
						if (isAtLeast) { // If at least, push least format
							if(scope.data.attrFieldsAtLeast.indexOf(attrValue) != -1) {
								var index = scope.data.attrFieldsAtLeast.indexOf(attrValue);
								scope.data.attrFieldsAtLeast.splice(index, 1);
								scope.data[attrValue] = '';
							}
						} else if (isAtMost) { // Otherwise, push most format
							if(scope.data.attrFieldsAtMost.indexOf(attrValue) != -1) {
								var index = scope.data.attrFieldsAtMost.indexOf(attrValue);
								scope.data.attrFieldsAtMost.splice(index, 1);
								scope.data[attrValue] = '';
							}
						}

					}

					if(val.indexOf(',') != -1){
						var splitVal = val.split(',');
						$.each(splitVal, function(i){
							if(scope.data.attr_id.indexOf(splitVal[i]) != -1){
								var index = scope.data.attr_id.indexOf(splitVal[i]);

								scope.data.attr_id.splice(index, 1);
							}
						})
					}else{
						if(scope.data.attr_id.indexOf(val) != -1){
							var index = scope.data.attr_id.indexOf(val);

							scope.data.attr_id.splice(index, 1)
						}
					}



				}

				if(scope.data.attr_id.length > 1){
					scope.data.attr_id = scope.data.attr_id.join(',');
				}else{
					scope.data.attr_id = scope.data.attr_id;
				}
				// var checked = $(this).is(':checked'),
				// 	val = $(this).val();

				// if(checked){
				// 	scope.data.attr_id.push(val);
				// }else{
				// 	if(scope.data.attr_id.indexOf(val) != -1){
				// 		var index = scope.data.attr_id.indexOf(val);

				// 		scope.data.attr_id.splice(index, 1)
				// 	}
				// }
				scope.$apply(); //very important. This triggers an update in the controller
			})
		}
	}
});

/**
 */
categoryResults.directive('typeCheckbox', function(){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			if(attrs.checked){
				scope.data.type.push(attrs.value);
			}
			elem.on('change', function(){
				var checked = $(this).is(':checked'),
					val = $(this).val();

				if(checked){
					if(scope.data.type.indexOf(val) == -1){
						scope.data.type.push(val);
					}
				}else{
					if(scope.data.type.indexOf(val) != -1){
						var index = scope.data.type.indexOf(val);

						scope.data.type.splice(index, 1);
					}
				}
				scope.$apply();
			});
		}
	}
});

/**
 */
categoryResults.directive('catCheckbox', function(){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			if(attrs.checked){
				scope.data.categoryId.push(attrs.value);
			}

			elem.on('change', function(){
				var checked = $(this).is(':checked');
				var val = $(this).val();
				var fieldName = $(this).attr('name');

				if(checked){
					if (fieldName == 'locationCategoryId') {
						if(scope.data.locationCategoryId.indexOf(val) == -1){
							scope.data.locationCategoryId.push(val);
						}
					} else {
						if(scope.data.categoryId.indexOf(val) == -1){
							scope.data.categoryId.push(val);
						}
					}
				} else {
					if (fieldName == 'locationCategoryId') {
						if(scope.data.locationCategoryId.indexOf(val) != -1){
							var index = scope.data.locationCategoryId.indexOf(val);

							scope.data.locationCategoryId.splice(index, 1);
						}
					} else {
						if(scope.data.categoryId.indexOf(val) != -1){
							var index = scope.data.categoryId.indexOf(val);

							scope.data.categoryId.splice(index, 1);
						}
					}
				}
				scope.$apply();
			});
		}
	}
});

/**
 */
categoryResults.directive('zonesCheckbox', function() {

	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {

			if (scope.preloadedRegions.indexOf(',')) {
				var preloadedRegions = scope.preloadedRegions.split(',');
			} else {
				var preloadedRegions = [scope.preloadedRegions];
			}

			if (elem.val().indexOf(',') != -1) {

				var splitVal = elem.val().split(',');
				$.each(splitVal, function(i) {

					if (preloadedRegions.indexOf(splitVal[i]) != -1) {
						elem.prop('checked', true);
						elem.next().addClass('checked');
					}

					// if (scope.data.region_id.indexOf(splitVal[i]) != -1) {
					// 	elem.prop('checked', true);
					// 	elem.next().addClass('checked');
					// }

				});

			} else {

				if (preloadedRegions.indexOf(elem.val()) != -1) {
					//turns out to check a "custom" checkbox yu need to add a class to the label. That's what next() is looking for.
					elem.prop('checked', true);
					elem.next().addClass('checked');
				}

				// if (scope.data.region_id.indexOf(elem.val()) != -1) {
				// 	//turns out to check a "custom" checkbox yu need to add a class to the label. That's what next() is looking for.
				// 	elem.prop('checked', true);
				// 	elem.next().addClass('checked');
				// }

			}

			elem.on('change', function() {

				var checked = $(this).is(':checked'),
					val = $(this).val();

				// if we do not yet have an array for region_id, create one so we don't error out
				if (!$.isArray(scope.data.region_id)) {
					scope.data.region_id = scope.data.region_id.split(',');
				}

				if (checked) {

					if (val.indexOf(',') != -1) {
						var splitVal = val.split(',');
						$.each(splitVal, function(i) {
							if (scope.data.region_id.indexOf(splitVal[i]) == -1) {
								scope.data.region_id.push(splitVal[i]);
							}
						});
					} else {
						scope.data.region_id.push(val);
					}

				} else {

					if(val.indexOf(',') != -1){
						var splitVal = val.split(',');
						$.each(splitVal, function(i){
							if(scope.data.region_id.indexOf(splitVal[i]) != -1){
								var index = scope.data.region_id.indexOf(splitVal[i]);

								scope.data.region_id.splice(index, 1);
							}
						});
					} else {
						if(scope.data.region_id.indexOf(val) != -1){
							var index = scope.data.region_id.indexOf(val);
							scope.data.region_id.splice(index, 1)
						}
					}

				}

				if (scope.data.region_id.length > 1) {
					scope.data.region_id = scope.data.region_id.join(',');
				} else {
					scope.data.region_id = scope.data.region_id;
				}

				scope.$apply();

			});
		}
	}

});

/**
 * Render Pagination for results
 *	This affects a template part called "Angular - Paging"
 */
categoryResults.directive('resultsPagination', function($compile){
	return {
		restrict: 'A',
		scope: {
			results: '=results',
			total: '=total',
			pagesize: '=pagesize',
			pageindex: '=pageindex',
			parentScope: '=pscope'
		},
		link: function(scope, elem, attrs){
			var pages;

			scope.$watch('results', function(newVal, oldVal){
				var html = '';

				if(typeof newVal != 'undefined'){
					pages = Math.ceil((scope.total/scope.pagesize));
					scope.pages = pages;
					var	incremenet = ((scope.pageindex+5) >= pages) ? pages : ((scope.pageindex*1)+5),
						startInc = ((scope.pageindex > 5)) ? (scope.pageindex-3) : 0,
						from = ((scope.pageindex*scope.pagesize)),
						to = ((scope.pageindex*scope.pagesize)+scope.pagesize)

					from = (from == 0) ? 1 : (from+1);
					to = (to > scope.total) ? scope.total : to;
					if (scope.total > 0) {
						scope.resultCount = '<p class="category-results-info"><span class="category-results-info-num-results">'+from+' - '+to+' of '+scope.total+' result'+((scope.total> 1 || scope.total== 0) ? 's' : '')+'</span></p>';
						scope.parentScope.resultCount = from+' - '+to+' of '+scope.total+' result'+((scope.total> 1 || scope.total== 0) ? 's' : '');
						html += scope.resultCount;
					} else {
						scope.resultCount = '<p class="category-results-info"><span class="category-results-info-num-results">0 Results</span></p>';
						scope.parentScope.resultCount = '0 Results';
						html += scope.resultCount;
					}

					// Render the pagination
					if(scope.pagesize < scope.total){

						// Open unordered list
						//
						html += '<ul class="clearfix">';

						// Render "previous" button
						//
						if((scope.pageindex > 0)){
							html += '<li class="prev"><a href="javascript: void(0);" class="page" ng-click="pager('+(scope.pageindex-1)+')" title="Go to the previous results page">Previous</a></li>';
						}

						// Ellipsis
						//
						// if(scope.pageindex > 5){
						// 	html += '<li><a href="javascript: void(0);" class="page button" ng-click="pager(0)" title="Go to the first page of the results">1</a></li>';
						// 	html += '<li><span class="page ellipsis">...</span></li>';
						// }

						// Render page numbers
						//
						// for(var i=startInc; i<incremenet; i++){
						// 	var isActive = (scope.pageindex == i) ? 'is-active' : '';
						// 	html += '<li>';
						// 		html += '<a href="javascript: void(0);" class="page button '+isActive+'" ng-click="pager('+i+')" title="Go to page '+(i+1)+' of the results">'
						// 			if(i == startInc && i != 0){
						// 				html += '...';
						// 			}
						// 			html += (i+1);
						// 			if((i+1) == incremenet && (i+1) < pages){
						// 				html += '...';
						// 			}
						// 		html += '</a>'
						// 	html += '</li>';
						// }

						// Ellipsis
						//
						// if((scope.pageindex+1) < pages && pages > incremenet){
						// 	html += '<li><span class="page ellipsis">...</span></li>';
						// 	html += '<li><a href="javascript: void(0);" class="page button" ng-click="pager('+(pages-1)+')" title="Go to page '+(pages)+' of the results">'+(pages)+'</a></li>';
						// }

						// Render "next" button
						//
						if(((scope.pageindex*1)+1) < pages){
							html += '<li class="next"><a href="javascript: void(0);" class="page" ng-click="pager('+(scope.pageindex+1)+')" title="Go to the next results page">Next</a></li>';
						}

						// Close unordered list
						//
						html +=' </ul>';
					}

					var compiled = angular.element(html);
					$compile(compiled)(scope);
					elem.html(compiled);
				}
			}, true);

			scope.pager = function(page){
				//scrolls results back to the top. Then updates the current page.
				$('body,html').animate({
					scrollTop: $('#results').offset().top - 130 + 'px'
				}, 1000, function(){
					scope.pageindex = page;
					// if(typeof scope.parentScope.infoBox != 'undefined'){
					// 	scope.parentScope.infoBox.setLocation(new Microsoft.Maps.Location(0, 0));
					// }
					$('.infobox').hide();
					scope.$apply();

					corpuschristitex.categoryResultsMap.buildMap();
				});
			}
		}
	}
});

categoryResults.directive('parentForm', function(){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			scope.parentID = attrs.parentForm;
			if(scope.preloadedClassifs == attrs.parentForm || scope.preloadedClassifs == ''){
				scope.data.class_id = attrs.parentForm;
			}else{
				scope.data.class_id = scope.preloadedClassifs;
			}

			if(scope.preloadedAmenities != ''){
				scope.data.attr_id = scope.preloadedAmenities;
			}else{
				scope.data.attr_id = (typeof attrs.startamens != 'undefined') ? attrs.startamens : [];
			}

			scope.origLat = (getParam('lat') != '') ? getParam('lat') : (typeof attrs.lat != 'undefined') ? attrs.lat : '';
			scope.origLon = (getParam('lon') != '') ? getParam('lon') : (typeof attrs.lon != 'undefined') ? attrs.lon : '';
			scope.data.lat = (getParam('lat') != '') ? getParam('lat') : (typeof attrs.lat != 'undefined') ? attrs.lat : '';
			scope.data.lon = (getParam('lon') != '') ? getParam('lon') : (typeof attrs.lon != 'undefined') ? attrs.lon : '';
			scope.data.city = (typeof attrs.city != 'undefined') ? attrs.city : (getParam('city') != '') ? getParam('city') : '';
			scope.city = (typeof attrs.city != 'undefined') ? attrs.city : (getParam('city') != '') ? getParam('city') : '';
			scope.data.radius = (getParam('radius') != '') ? getParam('radius') : (typeof attrs.radius != 'undefined') ? attrs.radius : scope.data.radius;
			//scope.data.locationid = (getParam('locationid') != '') ? getParam('locationid') : attrs.locationid;
			scope.data.locationid = (getParam('location_id') != '') ? getParam('location_id') : (getParam('locationid') != '') ? getParam('locationid') : '';
			scope.data.region_id = (getParam('region_id') != '') ? getParam('region_id') : '';
			scope.data.pageSize = (typeof attrs.showme != 'undefined' && $.trim(attrs.showme) != '') ? (attrs.showme*1) : 20;
			scope.pageTitle = attrs.pagetitle;
			scope.resultsText = (typeof attrs.resultstext != 'undefined') ? attrs.resultstext : 'Results';
			scope.data.sort = (typeof attrs.sort != 'undefined') ? attrs.sort : scope.data.sort;

			scope.history = (typeof attrs.history != 'undefined') ? true : false;
			scope.data.type = attrs.type;
			scope.listingResult = attrs.listingResult;

			if (scope.data.type != "reitlistings" && (typeof scope.data.startDate == 'undefined' || scope.data.startDate == '')) {

				var today = new Date();

				var month = today.getMonth() + 1;
				var formatedMonth = month >= 10 ? month : '0' + month;
				var date = today.getDate();
				var formatedDate = date >= 10 ? date : '0' + date;
				var year = today.getFullYear();
				var dateString = formatedMonth + '/' + formatedDate + '/' + today.getFullYear();

				scope.data.startDate = dateString;
			}

		}
	}
});

/**
 * Travel Ideas
 */
categoryResults.directive('travelIdeas', function($http){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			scope.history = (typeof attrs.history != 'undefined') ? true : false;
			if(typeof scope.data.categoryId == 'undefined'){
				scope.data.categoryId = [attrs.travelIdeas];
			}
			scope.origId = attrs.travelIdeas;
		}
	}
});

categoryResults.directive('travelIdeaCheckbox', function(){
	return {
		restrict: 'C',
		link: function(scope, elem, attrs){
		if(typeof scope.data.categoryId != 'undefined'){

			if(scope.data.categoryId.indexOf(',')){
				var categoryId = scope.data.categoryId.split(',');
			}else{
				var categoryId = [scope.data.categoryId];
			}
		}else{
			if(getParam('id').indexOf(',')){
				var categoryId = getParam('id').split(',');
			}else{
				var categoryId = [getParam('id')];
			}
		}
		if(elem.val().indexOf(',') != -1){
			var splitVal = elem.val().split(',');
			$.each(splitVal, function(i){
				if(categoryId.indexOf(splitVal[i]) != -1){
					elem.prop('checked', true);
					elem.next().addClass('checked');
				}
			})
		}else{
			if(categoryId.indexOf(elem.val()) != -1) {
				//turns out to check a "custom" checkbox yu need to add a class to the label. That's what next() is looking for.
				elem.prop('checked', true);
				elem.next().addClass('checked');
			}
		}
		// if(scope.categoryId && scope.categoryId.indexOf(elem.val()) != -1) {
		// 	//turns out to check a "custom" checkbox yu need to add a class to the label. That's what next() is looking for.
		// 	elem.prop('checked', true);
		// 	elem.next().addClass('checked');
		// }
		elem.on('change', function(){
			var checked = $(this).is(':checked'),
				val = $(this).val();

			if(!$.isArray(scope.data.categoryId)){
				scope.data.categoryId = scope.data.categoryId.split(',');
			}
			if(checked){
				if(scope.origId.indexOf(',') != -1){
					if(scope.origId == scope.data.categoryId.join(',')){
						scope.data.categoryId = [];
					}
				}else{
					if(scope.data.categoryId.indexOf(scope.origId) != -1){
						scope.data.categoryId = [];
					}
				}
				// if(scope.parentID.indexOf(',') != -1){
				// 	if(scope.parentID == scope.data.categoryId.join(',')){
				// 		scope.data.categoryId = [];
				// 	}
				// }else{
				// 	if(scope.data.categoryId.indexOf(scope.parentID) != -1){
				// 		scope.data.categoryId = [];
				// 	}
				// }
				if(val.indexOf(',') != -1){
					var splitVal = val.split(',');
					$.each(splitVal, function(i){
						if(scope.data.categoryId.indexOf(splitVal[i]) == -1){
							scope.data.categoryId.push(splitVal[i]);
						}
					})
				}else{
					scope.data.categoryId.push(val);
				}
			}else{
				if(val.indexOf(',') != -1){
					var splitVal = val.split(',');
					$.each(splitVal, function(i){
						if(scope.data.categoryId.indexOf(splitVal[i]) != -1){
							var index = scope.data.categoryId.indexOf(splitVal[i]);

							scope.data.categoryId.splice(index, 1);
						}
					})
				}else{
					if(scope.data.categoryId.indexOf(val) != -1){
						var index = scope.data.categoryId.indexOf(val);

						scope.data.categoryId.splice(index, 1)
					}
				}
				if(scope.data.categoryId.length == 0){
					scope.data.categoryId.push(scope.origId)
				}
				// console.log(scope.data.categoryId.length);
				// if(scope.data.categoryId.length == 0){
				// 	scope.data.categoryId.push(scope.parentID)
				// }
			}
			if(scope.data.categoryId.length > 1){
				scope.data.categoryId = scope.data.categoryId.join(',');
			}else{
				scope.data.categoryId = scope.data.categoryId;
			}
			// if(attrs.checked){
			// 	scope.data.categoryId.push(attrs.value);
			// }

			// elem.on('change', function(){
			// 	var checked = $(this).is(':checked'),
			// 		val = $(this).val();

			// 	if(checked){
			// 		if(scope.data.categoryId.indexOf(val) == -1){
			// 			scope.data.categoryId.push(val);
			// 		}
			// 	}else{
			// 		if(scope.data.categoryId.indexOf(val) != -1){
			// 			var index = scope.data.categoryId.indexOf(val);

			// 			scope.data.categoryId.splice(index, 1);
			// 		}
			// 	}
				scope.$apply();
			});
		}
	}
});

/**
 */
categoryResults.directive('searchResult', function($compile) {

	return {
		restrict: 'C',
		link: function(scope, elem, attrs) {

			if (scope.totalResults !== undefined) {

				/* Markup for the banner ads! */
				var index = BREI.searchResultIndex,
					html = '',
					zoneUrl = '',
					regionId = 0

				var bannerCount = [];
				bannerCount[1] = [1, 2];
				bannerCount[2] = [3, 4];
				bannerCount[3] = [5, 6];

				// set up permalink
				var url;
				switch ((String(attrs.type))) {
					// events
					case '3' :
					case 'Events' :
						url = '/events/';
						break;
					// stay
					case '1' :
					case 'Stay' :
						url = '/stay/';
						break;
					// See & Do
					case '2' :
					case 'See and Do' :
						url = '/see-and-do/';
						break;
					// eat
					case '171' :
					case 'Eat' :
						url = '/eat/';
						break;
					// Resources/Services
					case '220' :
						url = '/resources/';
						break;
					// Certified Wildlife Guides
					case '4' :
					case 'Certified Wildlife Guides' :
						url = '/guides/';
						break;
					case '220' :
					case 'Resources/Services' :
						url = '/resources/';
						break;
					case 'File' :
					case 'Page' :
						// left blank so it will default to what the datasource returns
						break;
					// deals
					case 'reitdiscounts' :
						url = '/deals/';
						break;
					// deals in the site search
					case 'See and Do Deals' :
					case 'Stay Deals' :
					case 'Eat Deals' :
					case 'Seasonal Deals' :
						url = '/deal-details/?discountid=';
						break;
					default:
					 	url = '/deals/';
					 	break;
				}
				scope.url = url;

				//
				// google
				//
				if (index > 0 && index % 5 == 0 && scope.totalResults > 5) {
					html +='<li class="banners-result">';
						html +='<section class="banners clearfix">';
							html +='<div class="banners-wrapper clearfix">';
								html +='<div class="banners-container clearfix">';
									html +='<div class="banners-grid">';
										html +='<ul class="banners-showcase clearfix">';
											html +='<li class="banner-'+bannerCount[index/5][0]+'" id="results-banner'+bannerCount[index/5][0]+'"></li>';
											html +='<li class="banner-'+bannerCount[index/5][1]+'" id="results-banner'+bannerCount[index/5][1]+'"></li>';
										html +='</ul><!-- /banners-showcase -->';
									html +='</div><!-- /banners-grid -->';
								html +='</div><!-- /banners-container -->';
							html +='</div><!-- /banners-wrapper -->';
						html +='</section><!-- /banners -->';
					html +='</li>';
				}

				if ($('.banners-result').length && index == 0 || scope.totalResults == 0) {
					$('.banners-result').remove();
				}

				if (index > 0 && index % 5 == 0 && scope.totalResults > 5) {
					if (typeof(googletag) != 'undefined') {

						setTimeout(function () {
							googletag.display('results-banner1');
							googletag.display('results-banner2');
						}, 1000);

						setTimeout(function () {
							googletag.display('results-banner3');
							googletag.display('results-banner4');
						}, 2000);

						setTimeout(function () {
							googletag.display('results-banner5');
							googletag.display('results-banner6');
						}, 3000);

						elem.before(html);

					}
				}

				//
				// end google
				//

				if (index >= scope.results.length - 1) {
					corpuschristitex.main.afterResult();
				}

				// keep track of where we are in the results.
				BREI.searchResultIndex += 1;
			}
		}
	}

});

/**
 */
categoryResults.directive('categoryResult', function($compile) {

	return {
		restrict: 'C',
		link: function(scope, elem, attrs) {

			if (scope.totalResults !== undefined) {

				/* Markup for the banner ads! */
				var index = BREI.searchResultIndex,
					html = '',
					zoneUrl = '',
					regionId = 0

				var bannerCount = [];
				bannerCount[1] = [1, 2];
				bannerCount[2] = [3, 4];
				bannerCount[3] = [5, 6];

				// set up permalink
				var url = "";

				scope.url = ""; // url;

				// determine the region url
				if (typeof scope.results[index] !== 'undefined') {

					var regionId = scope.results[index]._source.type_fields.region_id;
					switch (regionId) {
						case 3 : {
							zoneUrl = '/explore/downtown/';
							break
						}
						case 5 : {
							zoneUrl = '/explore/central/';
							break
						}
						case 7 : {
							zoneUrl = '/explore/mustang-island/';
							break
						}
						case 9 : {
							zoneUrl = '/explore/north-bay/';
							break
						}
						case 1 : {
							zoneUrl = '/explore/north-beach/';
							break
						}
						case 4 : {
							zoneUrl = '/explore/northwest/';
							break
						}
						case 15 : {
							zoneUrl = '/explore/padre-island/';
							break
						}
						case 8 : {
							zoneUrl = '/explore/port-aransas/';
							break
						}
						case 6 : {
							zoneUrl = '/explore/southside/';
							break
						}
						case 10 : {
							zoneUrl = '/explore/surrounding-areas/';
							break
						}
					}
					scope.zoneUrl = zoneUrl;

					// ensure distance is in the result
					if (scope.results[index].fields.distance != null) {
						distance = Number(scope.results[index].fields.distance[0] * 0.000621371192).toFixed(2);
						scope.distance = distance;
					}

					// adds dailyMin and dailyMax to the data object so we can access it in the html template
					var attributes = scope.results[index]._source.database_fields.attributes;
					scope.dailyMin = getREIAttributeByValue(attributes, 'attr_name', 'Daily Indoor Minimum', 'attr_value');
					scope.dailyMax = getREIAttributeByValue(attributes, 'attr_name', 'Daily Indoor Maximum', 'attr_value');
				}

				//
				// google
				//
				if (index > 0 && index % 5 == 0 && scope.totalResults > 5) {
					html +='<li class="banners-result">';
						html +='<section class="banners clearfix">';
							html +='<div class="banners-wrapper clearfix">';
								html +='<div class="banners-container clearfix">';
									html +='<div class="banners-grid">';
										html +='<ul class="banners-showcase clearfix">';
											html +='<li class="banner-'+bannerCount[index/5][0]+'" id="results-banner'+bannerCount[index/5][0]+'"></li>';
											html +='<li class="banner-'+bannerCount[index/5][1]+'" id="results-banner'+bannerCount[index/5][1]+'"></li>';
										html +='</ul><!-- /banners-showcase -->';
									html +='</div><!-- /banners-grid -->';
								html +='</div><!-- /banners-container -->';
							html +='</div><!-- /banners-wrapper -->';
						html +='</section><!-- /banners -->';
					html +='</li>';
				}

				if ($('.banners-result').length && index == 0 || scope.totalResults == 0) {
					$('.banners-result').remove();
				}

				if (index > 0 && index % 5 == 0 && scope.totalResults > 5) {
					if (typeof(googletag) != 'undefined') {

						setTimeout(function () {
							googletag.display('results-banner1');
							googletag.display('results-banner2');
						}, 1000);

						setTimeout(function () {
							googletag.display('results-banner3');
							googletag.display('results-banner4');
						}, 2000);

						setTimeout(function () {
							googletag.display('results-banner5');
							googletag.display('results-banner6');
						}, 3000);

						elem.before(html);

					}
				}

				//
				// end google
				//

				if (index >= scope.results.length - 1) {
					corpuschristitex.main.afterResult();
				}

				// this is old code that seemed unused
				// scope.$watch('totalResults', function() {
				// 	if ($('.banners-result').length && index == 0 || scope.totalResults == 0) {
				// 		$('.banners-result').remove();
				// 	}
				// 	if (index > 0 && index % 5 == 0 && scope.totalResults > 5) {
				// 		if (typeof(googletag) != 'undefined') {

				// 			setTimeout(function () {
				// 				googletag.display('results-banner1');
				// 				googletag.display('results-banner2');
				// 				googletag.display('results-banner3');
				// 			}, 1000);

				// 			setTimeout(function () {
				// 				googletag.display('results-banner4');
				// 				googletag.display('results-banner5');
				// 				googletag.display('results-banner6');
				// 			}, 2000);

				// 			setTimeout(function () {
				// 				googletag.display('results-banner7');
				// 				googletag.display('results-banner8');
				// 				googletag.display('results-banner9');
				// 			}, 3000);

				// 			elem.before(html);

				// 		}
				// 	}
				// 	if (index >= scope.results.length - 1) {
				// 		breilabs.favorites.rebuild();
				// 	}
				// });

				/* code for the pins */
				if (typeof attrs.lat != 'undefined' && typeof attrs.lon != 'undefined') {
					corpuschristitex.categoryResultsMap.addPoint(attrs, scope.r, url);
				}

				// keep track of where we are in the results.
				BREI.searchResultIndex += 1;
			}
		}
	}

});

/**
 */
categoryResults.directive('placeholder', function(){
	return {
		restrict: 'A',
		link: function(scope, elem, attrs){
			scope.$watch('ready', function(){
				if (!Modernizr.input.placeholder) {
					var place = elem.attr('placeholder');

					elem.val(place);
					elem.css('color', '#ccc');

					elem.bind('focus', function () {
						elem.css('color', '#000');

						if ($.trim(elem.val()) === place) {
							elem.val('');
						}
					});
					elem.bind('blur', function () {
						if ($.trim(elem.val()) === '') {
							elem.val(place);
							elem.css('color', '#ccc');
						}
					});

					elem.addClass('ph');
				}
			})
		}
	}
})

/**
 */
categoryResults.directive('sortableBtn', function(){
	return {
		restrict: 'C',
		link: function(scope, elem, attrs){
			scope.$watch('data.sort', function(newVal, oldVal){
				if(newVal != oldVal){
					if(newVal != attrs.ngTrueValue){
						elem.prop('checked', false);
						elem.next().removeClass('checked');
					}
				}
				if(getParam('sort') != ''){
					if(attrs.ngTrueValue == getParam('sort')){
						elem.prop('checked', true);
						elem.next().addClass('checked');
					}
				}
			});
			// elem.on('change', function(){
			// 	var isChecked = $(this).next().hasClass('checked'),
			// 		_this = $(this),
			// 		attrName = $(this).attr('name');

			// 	if(isChecked){
			// 		$(this).prop('checked', true);
			// 		$(this).next().addClass('checked');
			// 	}else{
			// 		$(this).prop('checked', false);
			// 		$(this).next().removeClass('checked');
			// 	}

			// 	$('.sortableBtn:checked').each(function(){
			// 		if(attrName != $(this).attr('name')){
			// 			$(this).prop('checked', false);
			// 			$(this).next().removeClass('checked');
			// 		}
			// 	});


			// 	scope.$apply();
			// })
		}
	}
});

/**
 */
categoryResults.directive('dealtype', function(){
	return {
		restrict: 'C',
		link: function(scope, elem, attrs){
			//checks to make sure that there is a query string for the classifs, then if the element value matches whats in the query string it checks it.
			// if(scope.data.discounttypeid && scope.data.discounttypeid.indexOf(elem.val()) != -1) {
			// 	//turns out to check a "custom" checkbox yu need to add a class to the label. That's what next() is looking for.
			// 	elem.next().addClass('checked');
			// }

			if(elem.val().indexOf(',') != -1){
				var splitVal = elem.val().split(',');
				$.each(splitVal, function(i){
					if(scope.data.discounttypeid.indexOf(splitVal[i]) != -1){
						elem.prop('checked', true);
						elem.next().addClass('checked');
					}
				})
			}else{
				if(scope.data.discounttypeid.indexOf(elem.val()) != -1) {
					//turns out to check a "custom" checkbox yu need to add a class to the label. That's what next() is looking for.
					elem.prop('checked', true);
					elem.next().addClass('checked');
				}
			}

			elem.on('change', function(){
				var checked = $(this).is(':checked'),
					val = $(this).val();

				if(!$.isArray(scope.data.discounttypeid)){
					scope.data.discounttypeid = scope.data.discounttypeid.split(',');
				}
				if(checked){
					if(scope.parentID.indexOf(',') != -1){
						if(scope.parentID == scope.data.discounttypeid.join(',')){
							scope.data.discounttypeid = [];
						}
					}else{
						if(scope.data.discounttypeid.indexOf(scope.parentID) != -1){
							scope.data.discounttypeid = [];
						}
					}
					if(val.indexOf(',') != -1){
						var splitVal = val.split(',');
						$.each(splitVal, function(i){
							if(scope.data.discounttypeid.indexOf(splitVal[i]) == -1){
								scope.data.discounttypeid.push(splitVal[i]);
							}
						})
					}else{
						scope.data.discounttypeid.push(val);
					}
				}else{
					if(val.indexOf(',') != -1){
						var splitVal = val.split(',');
						$.each(splitVal, function(i){
							if(scope.data.discounttypeid.indexOf(splitVal[i]) != -1){
								var index = scope.data.discounttypeid.indexOf(splitVal[i]);

								scope.data.discounttypeid.splice(index, 1);
							}
						})
					}else{
						if(scope.data.discounttypeid.indexOf(val) != -1){
							var index = scope.data.discounttypeid.indexOf(val);

							scope.data.discounttypeid.splice(index, 1)
						}
					}

					if(scope.data.discounttypeid.length == 0){
						scope.data.discounttypeid.push(scope.parentID)
					}
				}

				// 	scope.data.discounttypeid.push(val);
				// }else{
				// 	if(scope.data.discounttypeid.indexOf(val) != -1){
				// 		var index = scope.data.discounttypeid.indexOf(val);

				// 		scope.data.discounttypeid.splice(index, 1)
				// 	}
				// }
				scope.$apply(); //very important. This triggers an update in the controller
			})
		}
	}
});

/** This shouldn't be based on the url, it should be based on the category ID. -imoffitt */
categoryResults.filter('analyticsAction', function () {
	return function(input, type) {

		var r = input,
			t = type;

		if (t == null || t == '') {
			t = 'reitlistings';
		}

		switch (t) {
			case 'reitlistings':
			default:
				switch ((String(input))) {
					// events
					case '3' :
					case 'Events' :
						r = 'Event';
						break;
					// stay
					case '1' :
					case 'Stay' :
						r = 'Stay';
						break;
					// See & Do
					case '2' :
					case 'See and Do' :
						r = 'See and Do';
						break;
					// eat
					case '171' :
					case 'Eat' :
						r = 'Eat';
						break;
					// Resources/Services
					case '220' :
						r = 'Resources';
						break;
					// Certified Wildlife Guides
					case '4' :
					case 'Certified Wildlife Guides' :
						r = 'Certified Wildlife Guides';
						break;
					case '220' :
					case 'Resources/Services' :
						r = 'Resources/Services';
						break;
					default:
						r = input;
						break;
				}
				break;
			case 'reitdiscounts':
				r = 'Deal'
				break;
		}

		return r;
	}
});

categoryResults.directive('associatedLink', function(){
	return {
		restrict: 'C',
		link: function(scope, elem, attrs){

			switch ((attrs.rootId)) {
				// events
				case '3' :
				case 'Events' :
					url = '/events/';
					break;
				// stay
				case '1' :
				case 'Stay' :
					url = '/stay/';
					break;
				// See & Do
				case '2' :
				case 'See and Do' :
					url = '/see-and-do/';
					break;
				// eat
				case '171' :
				case 'Eat' :
					url = '/eat/';
					break;
				// Resources/Services
				case '220' :
					url = '/resources/';
					break;
				// Certified Wildlife Guides
				case '4' :
				case 'Certified Wildlife Guides' :
					url = '/guides/';
					break;
				case '220' :
				case 'Resources/Services' :
					url = '/resources/';
					break;
				case 'File' :
				case 'Page' :
					// left blank so it will default to what the datasource returns
					break;
				// deals
				case 'reitdiscounts' :
					url = '/deals/';
					break;
				// deals in the site search
				case 'See and Do Deals' :
				case 'Stay Deals' :
				case 'Eat Deals' :
				case 'Seasonal Deals' :
					url = '/deal-details/?discountid=';
					break;
				default:
				 	url = '/deals/';
				 	break;
			}

			url = url+attrs.url;
			elem.attr('href', url);
		}
	}
});

/**
 */
categoryResults.directive('cityTown', function($http){
	return {
		restrict: 'C',
		link: function(scope, elem, attrs){
			var cities = [],
				allCityData;
			$http.get(BREI.URL + 'GetJsonData.ashx?id=18&locationTypeId=2&withGeoPoint=1').success(function(data){
				var arr = data.ArrayOfLocation.Location;
				allCityData = arr;
				$.each(arr, function(i){
					cities.push(arr[i].Name);
					allCityData[arr[i].Name] = {
						id: arr[i].ID,
						lat: arr[i].CenterPoint.Latitude,
						lon: arr[i].CenterPoint.Longitude
					}
					if(typeof arr[i].AlternateName != 'undefined'){
						cities.push(arr[i].AlternateName);
						allCityData[arr[i].AlternateName] = {
							id: arr[i].ID,
							lat: arr[i].CenterPoint.Latitude,
							lon: arr[i].CenterPoint.Longitude
						}
					}
				})
			});

			// elem.autocomplete({
			// 	source: cities,
			// 	appendTo: '.cities',
			// 	autoFocus: true,
			// 	messages: {
			// 		noResults: '',
			// 		results: function(){}
			// 	},
			// 	select: function(event, ui){
			// 		scope.data.city = ui.item.value;
			// 		scope.data.lat = allCityData[ui.item.value].lat;
			// 		scope.data.lon = allCityData[ui.item.value].lon;
			// 		scope.data.locationid = allCityData[ui.item.value].id;
			// 		scope.data.radius = (getParam('radius') != '' && getParam('radius') > 0) ? getParam('radius') : 15;

			// 		scope.$apply();
			// 	}
			// });

			// elem.data("ui-autocomplete")._renderMenu = function(ul, items){
			// 	var _this = this;

			// 	$.each(items, function(i, item){
			// 		item.label = item.label.replace(_this.term, "<strong>$&</strong>");

			// 		_this._renderItemData(ul, item);
			// 	});

			// 	$(ul).addClass('cityList');
			// };

			// elem.data("ui-autocomplete")._renderItem = function(ul, item){
			// 	return $( "<li>" ).attr( "data-value", item.value ).append( $( "<a>" ).html( item.label ) ).appendTo( ul );
			// }

			// $.ui.autocomplete.filter = function (array, term) {
			// 	var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
			// 	return $.grep(array, function (value) {
			// 		return matcher.test(value.label || value.value || value);
			// 	});
			// };
		}
	}
});

/**
 */
categoryResults.filter('locationLink', function() {
	return function(input, type) {

		var r = input;

		switch ((String(input))) {

			case '3': // Bayfront/Downtown
				r = '/explore/bayfront-downtown/';
				break;
			case '5': // Central
				r = '/explore/central/';
				break;
			case '7': // Mustang Island
				r = '/explore/mustang-island/';
				break;
			case '9': // North Bay
				r = '/explore/north-bay/';
				break;
			case '1': // North Beach
				r = '/explore/north-beach/';
				break;
			case '4': // Northwest
				r = '/explore/northwest/';
				break;
			case '15': // Padre Island
				r = '/explore/padre-island/';
				break;
			case '8': // Port Aransas
				r = '/explore/port-aransas/';
				break;
			case '6': // Southside
				r = '/explore/southside/';
				break;
			case '10': // Surrounding Areas
				r = '/explore/surround-areas/';
				break;
			case '11': // North Beach TEST
				r = '/explore/north-beach/';
				break;
			default:
				r = 'javascript:;'
				break;

		}

		return r;

	}
});

function getParam(name, allowMultiple){

	allowMultiple = typeof allowMultiple !== 'undefined' ? allowMultiple : false;

	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)", 'g');

	var strResult = "";
	if (allowMultiple) {
		while ((results = regex.exec(location.search)) !== null) {
			if (strResult != "") {
				strResult += ",";
			}
			strResult += results[1];

		}
	} else {
		results = regex.exec(location.search);
		if (results == null) {
			return "";
		}
		strResult = results[1];
	}

	return strResult == null ? "" : decodeURIComponent(strResult.replace(/\+/g, " "));
}

/**
 * Gets the value of an REI attribute based on.
 * 	getREIAttributeByValue(scope.results[0]._source.database_fields.attributes, 'attr_name', 'Daily Indoor Minimum', 'attr_value');
 */
function getREIAttributeByValue (array, attributeToMatch, attributeToMatchValue, attributeToGet) {

	var i = 0;
	var value = null;
	var attributes = array;

	if (typeof attributes !== 'undefined') {
		while (i < attributes.length) {
			if (attributes[i][attributeToMatch] === attributeToMatchValue) {
				value = attributes[i][attributeToGet];
				break
			}
			i++;
		}
	}

	return value;
}

function getDeepProperty(obj) {

	for (var i = 1; i < arguments.length; i++) {
		if (typeof obj === 'object') {
			obj = obj[arguments[i]];
		}
	}

	if (typeof obj === 'object') {
		return undefined;
	} else {
		return obj;
	}

};
