var mainApp = angular.module('mainApp', ['ui.router']);
var ROOT_API = 'https://info343.xyz/api/'
var CHALLENGE_URL = ROOT_API + 'challenges/all';
var LECTURE_URL = ROOT_API + 'lectures/all';

var LECTURE_TIME = 'T08:30:00.000Z';


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
		controller: 'challengesHomeCtrl'
	})
	.state('challengeView', {
		url: '/challenge/:id',
		templateUrl: '../pages/challengeview.html',
		controller: 'challengeViewCtrl'
	})
	.state('message', {
		url: '/board/:board',
		templateUrl: '../pages/board.html',
		controller: 'messageCtrl'
	}).state('error', {
		url: '*path',
		templateUrl: '../pages/error.html'
	})
});

mainApp.controller('homeCtrl', function($scope, $http, $sce) {

	//takes only the events that are 7 days ahead of the current date.
	function pruneEvent(list) {
		var newList = [];
		for(var i = 0; i < list.length; i++) {
			var difference = moment().diff(list[i].dueDate || list[i].date, 'days');
			if (difference <= 0 && difference >= -7) {
				newList.push(list[i]);
			}
		}
		return newList;
	}

	function evenlyFill(list, max) {
		for (var i = list.length; i < max; i++) {
			list.push({name: '\u00A0'});
		}
		return list;
	}

    $http.get(CHALLENGE_URL).success(function(challenge_result){
		$http.get(LECTURE_URL).success(function(lecture_result){
			var prunedChallenge = pruneEvent(challenge_result);
			var prunedLecture = pruneEvent(lecture_result);
			var max = Math.max(prunedChallenge.length, prunedLecture.length);

			$scope.challengeList = evenlyFill(prunedChallenge, max);
			$scope.lectureList = evenlyFill(prunedLecture, max);

			var weekView = calendarFeature(challenge_result, lecture_result);
			weekView.fullCalendar('changeView', 'basicWeek');
			weekView.fullCalendar('option', 'height', 222);
  		});
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
	$http.get(CHALLENGE_URL).success(function(challenge_result){
		$http.get(LECTURE_URL).success(function(lecture_result){
			calendarFeature(challenge_result, lecture_result);
  	});
  });
})

.controller('challengesHomeCtrl', function($scope, $http) {
	$http.get(CHALLENGE_URL).success(function(result){
		$scope.challengeList = result;
  	});
})

.controller('challengeViewCtrl', function($scope, $sce, $http, $stateParams) {
	//get teh challenge
	$http.get('pages/challenges/' + $stateParams.id + '.html').success(function(result) {
		$scope.challenge = $sce.trustAsHtml(result);
	})

	//get eh challenbge checklist
	$http.get(ROOT_API + 'items/' + $stateParams.id).then(function(items) {
		items = items.data;
		//console.log(items);
		$scope.items = items;
	})

	$http.get(ROOT_API + 'posts/' + $stateParams.id + '/top').then(function(post) {
		$scope.topPost = post.data[0][0];
		//console.log($scope.topPost);
	})

	$scope.checkItem = function(placement) {
		console.log("posting to: " + ROOT_API + 'checks/' + $stateParams.id + '/' + placement)
		$http.post(ROOT_API + 'checks/' + $stateParams.id + '/' + placement).then(function() {
			refreshChecks();
		});
	}
	
	$scope.loggedIn = false;
	$scope.checked = {};

	refreshChecks();

	function refreshChecks() {
		$http.get(ROOT_API + 'user').then(function(user) {
			if (user.data.status != 2) {
				$scope.loggedIn = true;
				$http.get(ROOT_API + 'checks/' + $stateParams.id).then(function(items) {
					//console.log(items);
					items = items.data;
					$scope.checked = {};
					for (item in items) {
						$scope.checked[items[item].listNumber] = true;
					}
					//console.log($scope.checked)
				});
			}
		});
	}

})

.controller('messageCtrl', function($scope, $http, $stateParams) {

	function getMessages() {
		$http.get(ROOT_API + "posts/" + $stateParams.board).then(function(posts) {
			console.log(posts)
			
			var unsorted = [];
			posts = posts.data[0];
			for (post in posts) {
				unsorted[posts[post].id] = posts[post];
			}

			$scope.parents = [];

			for (post in unsorted) {
				if (unsorted[post].parent != 0) {
					if (unsorted[unsorted[post].parent].children === undefined) {
						unsorted[unsorted[post].parent].children = [];
					}
					unsorted[unsorted[post].parent].children.push(unsorted[post]);
				} else {
					$scope.parents.push(unsorted[post]);
				}
			}
		
		})

		$http.get(ROOT_API + 'votes/my').then(function(votes) {
			votes = votes.data;
			console.log(votes)
			$scope.voteButtonStatus = {};
			for (vote in votes) {
				console.log(votes[vote])
				$scope.voteButtonStatus[votes[vote].post] = true;
			}
			console.log($scope.voteButtonStatus);
		});
	}

	$scope.replyAt = null;
	$scope.replyTitle = '';
	$scope.replyText = '';
	$scope.loggedIn = false;
	$scope.userNetId = '';
	$scope.challenge = {};

	$http.get(ROOT_API + 'user').then(function(user) {
		console.log(user.data);
		if (user.data.status && user.data.status == 2) {
			$scope.loggedIn = false;
		} else {
			$scope.loggedIn = true;
			$scope.userNetId = user.data.netId;
			console.log($scope.userNetId)
		}
	});

	$http.get(ROOT_API + 'challenges/' + $stateParams.board).then(function(challenge) {
		$scope.challenge = challenge.data;
		console.log($scope.challenge)
	});

	getMessages();

	$scope.postReply = function(id) {
		id = (id === 0 ? '' : id);
		var data = $('#form-' + id).serializeArray();
		$http.post(ROOT_API + 'posts/challenge/' + $stateParams.board, {
			title: data[0].value,
			text: data[1].value,
			parent: id
		}).then(function() {
			$scope.replyAt = null;
			getMessages();
		})
	}

	$scope.openReply = function(parent) {	
		$http.get(ROOT_API + 'user').then(function(user) {
			if (user.data.status && user.data.status == 2) {
				window.location = "https://info343.xyz/login";
				$scope.loggedIn = false;
			} else {
				$scope.loggedIn = true;
				$scope.userNetId = user.data.netId;
				parent = (parent === undefined ? 0 : parent);
				$scope.replyAt = parent;
			}
		})
	}

	$scope.upVote = function(id) {
		console.log(id)
		$http.get(ROOT_API + 'user').then(function(user) {
			if (user.data.status && user.data.status == 2) {
				window.location = "https://info343.xyz/login";
				$scope.loggedIn = false;
			} else {
				$scope.loggedIn = true;
				$http.post(ROOT_API + "votes/" + id).then(function() {
					getMessages();
				})
			}
		})
	}
});

function officeHourEvent(string, repeatArray, eventColor) {
	return {
    	title: string,
    	start: '2015-10-01T14:30:00.000Z',
    	end: '2015-12-11T16:00:00.000Z',
    	dow: repeatArray,
    	color: eventColor,
    	ranges: [
	   		{
		        start: moment('2015-10-01','YYYY-MM-DD'),
		        end: moment('2015-12-11','YYYY-MM-DD')
	    	}
	    ]

    }
}

function calendarFeature(c_list, l_list) {
	var parentCalendar = $('.calendar').fullCalendar(
		{
	        events: [
	        	officeHourEvent('Professor Office Hour', [1, 2], 'green'),
	        	officeHourEvent('TA Office Hour', [2, 4], '#9F81F7')
	        ],

	        // Determines whether or not to render the event
		    eventRender: function(event, element, view){
		        if (event.ranges)
			        return (event.ranges.filter(function(range){
			            return (event.start.isBefore(range.end) &&
			                    event.end.isAfter(range.start));
			        }).length) > 0;
			   	else
			   		return true;
		    },
	    	timeFormat: 'h(:mm)'
    	}	
	);

    return populateEvent(c_list, l_list, parentCalendar);
}

function populateEvent(c_list, l_list, parentCalendar) {
	for(var i = 0; i < c_list.length; i++) {
		var curr = c_list[i];
		var newEvent = {
                start: curr.dueDate,
                title: curr.name + ' Due',
                id: curr.id,
                color: '#cc0000',
                allDay: false,
                url: 'https://info343.xyz/index.html#/challenge/' + curr.id
            };

		parentCalendar.fullCalendar('renderEvent', newEvent, 'stick');
	}

	for(var i = 0; i < l_list.length; i++) {
		var curr = l_list[i];
		var newEvent = {
                start: (curr.date.substring(0, 10) + LECTURE_TIME),
                title: curr.name,
                id: curr.id,
                allDay: false,
                url: curr.slidesLink
            };

		parentCalendar.fullCalendar('renderEvent', newEvent, 'stick');
	}

	return parentCalendar;
}