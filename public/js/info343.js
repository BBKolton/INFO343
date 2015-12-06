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
	//HEEEEELP!!!!!!!!!!!!!!!!!!!!!!!!! It's not working :'(
	.state('challenges-1', {
		url: '/challenges/1',
		templateUrl: '../pages/challenge-1.html',
		controller: 'challenges-1Ctrl'
	})
	.state('challenges-2', {
		url: '/challenges/2',
		templateUrl: '../pages/challenge-2.html',
		controller: 'challenges-2Ctrl'
	})
	.state('challenges-3', {
		url: '/challenges/3',
		templateUrl: '../pages/challenge-3.html',
		controller: 'challenges-3Ctrl'
	})
});

mainApp.controller('homeCtrl', function($scope, $http) {
	$http.get(CHALLENGE_URL).success(function(result){
		var weekView = calendarFeature(result);
		weekView.fullCalendar('changeView', 'basicWeek');
		weekView.fullCalendar('option', 'height', 222);
    });
})

.controller('navCtrl', function($scope, $http) {
    //get a user's name and netId if they're logged in
    $http.get(ROOT_API + 'user').then(function(user) {
	    user = user.data;
    	if (user.status != 2) {
	    	$scope.userWelcome = "Hello, " + user.firstName + 
	    			" " + user.lastName;
	    	//console.log($scope.user);
    	} else {
    		$scope.userWelcome = "Login";
    	}
    });
})

.controller('syllabusCtrl', function($scope) {

})

.controller('calendarCtrl', function($scope, $http) {
	$http.get(CHALLENGE_URL).success(function(result){
		//$scope.challengeList = result;
		calendarFeature(result);
    });
})

.controller('challengesCtrl', function($scope, $http) {
	$http.get(CHALLENGE_URL).success(function(result){
		$scope.challengeList = result;
    });
})

.controller('messageCtrl', function($scope, $http) {

	function getMessages() {
		$http.get(ROOT_API + "posts/1").then(function(posts) {
			posts = posts.data;
			//console.log(posts);
			$scope.posts = posts;
		})
	}

	getMessages();

	$scope.postReply = function() {
		$http.post(ROOT_API + 'posts/challenge/1', {
			title: $scope.replyTitle,
			text: $scope.replyText
		}).then(function() {
			getMessages();
		})
	}
//HEEEEELP!!!!!!!!!!!!!!!!!!!!!!!!!
.controller('challenges-1Ctrl', function($scope, $http) {
	$http.get(ROOT_API + 'challenges/1').success(function(result){
		$scope.challenges = result;
		console.log(result);
    });
})
.controller('challenges-2Ctrl', function($scope, $http) {
	$http.get(ROOT_API + 'challenges/2').success(function(result){
		$scope.challengeInfo = result;
    });
})
.controller('challenges-3Ctrl', function($scope, $http) {
	$http.get(ROOT_API + 'challenges/3').success(function(result){
		$scope.challengeInfo = result;
    });
})

});

// honestly don't know how to pull out an ajax request elegantly...
// used by challenge, calendar, and homepage.

// function requestChallenges(scope, http) {
// 	http.get(CHALLENGE_URL).success(function(result){
// 		scope = result;
//     });
// }

function calendarFeature(list) {
	var parentCalendar = $('.calendar').fullCalendar(
		
	)

    return populateEvent(list, parentCalendar);
}

function populateEvent(list, parentCalendar) {
	console.log(list);
	for(var i = 0; i < list.length; i++) {
		var curr = list[i];
		// var eventObj = {
		// 	id: '' + curr.id,
		// 	title: '' + curr.name,
		// 	start: '' + curr.dueDate.substring(0, 10)

		// }
		// console.log(eventObj);
		parentCalendar.fullCalendar('renderEvent',
			{
				id: '' + curr.id,
				title: '' + curr.name,
				start: '' + curr.dueDate.substring(0, 10),
				allDay: true
			},
			true
		);
	}
	return parentCalendar;
}