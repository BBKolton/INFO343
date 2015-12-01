var mainApp = angular.module('mainApp', ['ui.router']);

mainApp.config(function($stateProvider) {
	$stateProvider.state('home', {
		url: '',
		templateUrl: '../pages/home.html',
		controller: 'homeCtrl'
	})
	.state('syllabus', {
		url: '/syllabus',
		templateUrl: '../pages/syllabus.html',
		controller: 'syllabusCtrl'
	})
	.state('calendar', {
		url: '/calendar',
		templateUrl: '../pages/calendar.html',
		controller: 'calendarCtrl'
	})
	.state('challenges', {
		url: '/challenges',
		templateUrl: '../pages/challenges.html',
		controller: 'challengesCtrl'
	})
});

mainApp.controller('homeCtrl', function($scope) {

})
.controller('syllabusCtrl', function($scope) {

})
.controller('calendarCtrl', function($scope) {

})
.controller('challengesCtrl', function($scope) {

});