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

mainApp.controller('homeCtrl', function($scope, $http) {
    $http.get(CHALLENGE_URL).success(function(challenge_result){
		$http.get(LECTURE_URL).success(function(lecture_result){
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
		//console.log(result);
		$scope.challenge = $sce.trustAsHtml(result);
	})

	//get eh challenbge checklist
	$http.get(ROOT_API + 'items/' + $stateParams.id).then(function(items) {
		items = items.data;
		console.log(items);
		$scope.items = items;
	})
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

var repeatingEvents = [{
    title:"My repeating event",
    id: 1,
    start: '10:00', // a start time (10am in this example)
    end: '14:00', // an end time (6pm in this example)
    dow: [ 1, 4 ], // Repeat monday and thursday
    ranges: [{ //repeating events are only displayed if they are within one of the following ranges.
        start: moment().startOf('week'), //next two weeks
        end: moment().endOf('week').add(7,'d')
    },{
        start: moment('2015-02-01','YYYY-MM-DD'), //all of february
        end: moment('2015-02-01','YYYY-MM-DD').endOf('month')
    }],
}];

function calendarFeature(c_list, l_list) {
	var parentCalendar = $('.calendar').fullCalendar(
		{
	        events: [{
	        	title: 'Professor Office Hour',
	        	start: '2015-10-01T14:30:00.000Z',
	        	end: '2015-12-09T16:00:00.000Z',
	        	dow: [1, 2],
	        	color: 'green',
	        	ranges: [
			   		{
				        start: moment('2015-10-01','YYYY-MM-DD'), //all of february
				        end: moment('2015-12-09','YYYY-MM-DD')
			    	}
			    ]

	        }, 

	        {
	        	title: 'TA Office Hour',
	        	start: '2015-10-01T10:30:00.000Z',
	        	end: '2015-12-11T12:00:00.000Z',
	        	dow: [2, 4],
	        	color: '#e67300',
	        	ranges: [
			   		{
				        start: moment('2015-10-01','YYYY-MM-DD'), //all of february
				        end: moment('2015-12-11','YYYY-MM-DD')
			    	}
			    ]

	        }],

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
                title: curr.name,
                id: curr.id,
                color: '#cc0000',
                allDay: false
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
