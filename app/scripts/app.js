'use strict';

angular
  .module('storyApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    //'ngRoute',
    'angularfire.login',
    'angularfire.firebase',
    'simpleLoginTools',
    'ui.event',
    'ui.router',
    'ngAnimate',
    'ui.bootstrap',
    'ngTagsInput'
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('inbox', {
        templateUrl: 'views/inbox.html',
        url: '/inbox',
        controller: 'InboxController'
      })
      .state('main', {
        templateUrl: 'views/main.html',
        url: '/',
        controller: 'MainCtrl'
      })
      .state('newStory', {
        templateUrl: 'views/newStory.html',
        url: '/newStory',
        controller: 'NewStoryController'
      })
      .state('addToStory', {
        templateUrl: 'views/addToStory.html',
        url: '/addToStory/{storyId}',
        controller: 'AddToStoryController'
      })
      .state('login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      ;
    // $stateProvider
    //   .when('/', {
    //     templateUrl: 'views/main.html',
    //     controller: 'MainCtrl'
    //   })
    //   .when('/login', {
    //     authRequired: false, // if true, must log in before viewing this page
    //     templateUrl: 'views/login.html',
    //     controller: 'LoginController'
    //   })
    //   .when('/newStory', {
    //     authRequired: true,
    //     templateUrl: 'views/newStory.html',
    //     controller: 'NewStoryController'
    //   })
    //   .when('/addToStory/:storyId', {
    //     authRequired: false,
    //     templateUrl: 'vies/addToStory.html',
    //     controller: 'AddToStoryController'
    //   })
    //   .when('/editStory', {
    //     templateUrl: 'views/storyBasics.html',
    //     controller: 'StoryBasicController'
    //   })
    //   .when('/viewStory', {
    //     templateUrl: 'views/storyMain.html',
    //     controller: 'StoryMainController'
    //   })
    //   .when('/storyDashboard', {
    //     templateUrl: 'views/storyDashboard.html',
    //     controller: 'StoryDashmoardController'
    //   })
    //   .otherwise({
    //     redirectTo: '/'
    //   });
  }).run(function($state){
    $state.go('main');
  });
