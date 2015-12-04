var mainApp = angular.module('mainApp', ['ui.router']);
var ROOT_API = 'https://info343.xyz/api/'
var CHALLENGE_URL = ROOT_API + 'challenges/all';

mainApp.config(function($stateProvider) {
	$stateProvider.state('default', {
		url: '',
		templateUrl: '../pages/home.html',
		controller: 'homeCtrl'
	})
	.state('home', {
		url: '/',
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
	.state('message', {
		url: '/message',
		templateUrl: '../pages/message.html',
		controller: 'messageCtrl'
	}).state('error', {
		url: '*path',
		templateUrl: '../pages/error.html',
		controller: 'errorCtrl'
	})
});

mainApp.controller('homeCtrl', function($scope, $http) {
	$http.get(CHALLENGE_URL).success(function(result){
		$scope.challengeList = result;
		calendarFeature(result);
    });


	var weekView = calendarFeature($scope.challengeList);
	weekView.fullCalendar('changeView', 'basicWeek');
	weekView.fullCalendar('option', 'height', 222);
})

.controller('navCtrl', function($scope, $http) {
    //get a user's name and netId if they're logged in
    $http.get(ROOT_API + 'user').then(function(user) {
	    user = user.data;
    	if (user.status != 2) {
	    	$scope.userWelcome = "Hello, " + user.firstName + 
	    			" " + user.lastName;
	    	console.log($scope.user);
    	} else {
    		$scope.userWelcome = "Login";
    	}
    });
})

.controller('syllabusCtrl', function($scope) {

})

.controller('calendarCtrl', function($scope, $http) {
	$http.get(CHALLENGE_URL).success(function(result){
		$scope.challengeList = result;
		calendarFeature(result);
    });
})

.controller('challengesCtrl', function($scope,  $http) {
	$http.get(CHALLENGE_URL).success(function(result){
		$scope.challengeList = result;
    });
})

.controller('messageCtrl', function($scope) {

});

// honestly don't know how to pull out an ajax request elegantly...
// used by challenge, calendar, and homepage.

// function requestChallenges(scope, http) {
// 	http.get(CHALLENGE_URL).success(function(result){
// 		scope = result;
//     });
// }

function calendarFeature(list) {
	var parentCalendar = $('.calendar').fullCalendar({
    	timeFormat: 'h(:mm)'
    })

    return populateEvent(list, parentCalendar);
}

function populateEvent(list, parentCalendar) {
	console.log(list);
	for(var i = 0; i < list.length; i++) {
		var curr = list[i];
		var eventObj = {
			id: '' + curr.id,
			title: '' + curr.name,
			start: '' + curr.dueDate

		}
		parentCalendar.fullCalendar('renderEvent', eventObj);
	}
	return parentCalendar;
}