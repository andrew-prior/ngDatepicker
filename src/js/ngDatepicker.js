angular.module('jkuri.datepicker', [])

.directive('ngDatepicker', ['$compile', function($compile) {
	'use strict';

	var setScopeValues = function (scope, attrs) {
		scope.format = attrs.format || 'YYYY-MM-DD';
		scope.viewFormat = attrs.viewFormat || 'Do MMMM YYYY';
		scope.locale = attrs.locale || 'sl';
	};

	return {
		restrict: 'EA',
		require: '?ngModel',
		scope: {

		},
		link: function (scope, element, attrs, ngModel) {
			setScopeValues(scope, attrs);

			scope.calendarOpened = false;
			scope.days = [];
			scope.dayNames = [];
			scope.viewValue;
			scope.dateValue;

			moment.locale(scope.locale);
			var date = moment();

			var calendar = angular.element(document.querySelectorAll('.calendar'));

			var generateCalendar = function (date) {
				var lastDayOfMonth = date.endOf('month').date(),
					month = date.month(),
					year = date.year(),
					i = 1;
			
				var firstWeekDay = date.set('date', 1).day();
				if (firstWeekDay !== 1) {
					i -= firstWeekDay;
				}

				scope.dateValue = date.format('MMMM YYYY');
				scope.days = [];

				for (var i = i; i <= lastDayOfMonth; i += 1) {
					if (i > 0) {
						scope.days.push({day: i, month: month + 1, year: year, enabled: true});
					} else {
						scope.days.push({day: null, month: null, year: null, enabled: false});
					}
				}
			};

			var generateDayNames = function () {
				var date = moment('2015-06-01');
				for (var i = 0; i < 7; i += 1) {
					scope.dayNames.push(date.format('ddd'));
					date.add('1', 'd');
				}
			};

			generateDayNames();

			scope.showCalendar = function () {
				scope.calendarOpened = true;
				generateCalendar(date);
			};

			scope.closeCalendar = function () {
				scope.calendarOpened = false;
			};

			scope.prevMonth = function () {
				date.subtract(1, 'M');
				generateCalendar(date);
			};

			scope.nextMonth = function () {
				date.add(1, 'M');
				generateCalendar(date);
			};

			scope.selectDate = function (event, date) {
				event.preventDefault();
				var selectedDate = moment(date.day + '.' + date.month + '.' + date.year, 'DD.MM.YYYY');
				ngModel.$setViewValue(selectedDate.format(scope.format));
				scope.viewValue = selectedDate.format(scope.viewFormat);
				scope.closeCalendar();
			};
		},
		template: 
		'<div><input type="text" ng-focus="showCalendar()" ng-value="viewValue"></div>' +
		'<div class="ng-datepicker" ng-show="calendarOpened">' +
		'  <div class="controls">' +
		'    <i class="fa fa-angle-left prev-month-btn" ng-click="prevMonth()"></i>' +
		'    <span class="date" ng-bind="dateValue"></span>' +
		'    <i class="fa fa-angle-right next-month-btn" ng-click="nextMonth()"></i>' +
		'  </div>' +
		'  <div class="day-names">' +
		'    <span ng-repeat="dn in dayNames">' +
		'      <span>{{ dn }}</span>' +
		'    </span>' +
		'  </div>' +
		'  <div class="calendar">' +
		'    <span ng-repeat="d in days">' +
		'      <span class="day" ng-click="selectDate($event, d)" ng-class="{disabled: !d.enabled}">{{ d.day }}</span>' +
		'    </span>' +
		'  </div>' +
		'</div>'
	};

}]);
