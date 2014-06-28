'use strict';

angular.module('storyApp')
  .controller('NewStoryController', function ($scope, StoryService, $state, TagsService, UserService) {

    $scope.story = {
      title: '',
      idea: '',
      tags: ''
    };
    var story = $scope.story;

    $scope.onStoryTitleClick = function() {
      console.log('onStoryTitleClick');
      if ( !$scope.story.showTitleInput ) {
        $scope.story.showTitleInput = true;
      }
    };

    $scope.keyEvent = function(event) {
      console.log(event.keyCode);
      if ( event.keyCode === 13 ) {
        $scope.story.showTitleInput = false;
      }
      // var key = event.keyCode || event.which;
      // var keychar = String.fromCharCode(key);
      // if (key == exampleKey) {
      //   metaChar = true;
      // }

    };

    $scope.onTitleFocus = function() {
      console.log('onTitleFocus');
    };

    $scope.onTitleBlur = function() {
      console.log('onTitleBlur');
      //$scope.story.showTitleInput=false;
    };

    $scope.onStoryIdeaFocus = function() {
      console.log('focus on story idea');
      //$scope.story.showStoryIdeaHelpText=true;
    };

    $scope.onStoryIdeaBlur = function() {
      console.log('blur on story idea');
      //$scope.showStoryIdeaHelpText=false;
    };

    $scope.saveStoryIdea = function() {
      console.log('saveStoryIdea');
      StoryService.addStory( $scope.story );
      //addStory( story );
      clearStory();
      $state.go('main');

    };

    $scope.cancelStory = function() {
      console.log('cancelStory');
      clearStory();
      $state.go('main');
    };

    function clearStory() {
      $scope.story.title = '';
      $scope.story.idea = '';
      $scope.story.tags = '';
    }

    // $scope.stories = syncData('messages');
    // $scope.all = syncData();
    // $scope.x3 = syncData('x3');

    //$scope.stories = syncData('stories');
    // $scope.addStory = function (storyInfo) {
    //   console.log('***addStory');
    //   $scope.stories.$add( storyInfo ).then(function(ref) {
    //     console.log('ref.name() = ', ref.name());
    //   });
    // };

    // $scope.whatIsTheFuckingUser = function() {
    //   // return StoryService.currentUser();
    //   return $rootScope.currentUser();
    // };
    // $scope.isSignedIn = function() {
    //   // return StoryService.signedIn();
    //   return $rootScope.signedIn();
    // };

    $scope.userSelected = undefined;
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida',
      'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
      'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
      'West Virginia', 'Wisconsin', 'Wyoming'];

    $scope.inputTags = undefined;
    $scope.loadTags = function( query ) {
      // return TagsService.getTagsMatching( query );
      console.log('query = ', query);
      return TagsService.getTagsMatching(query);
    };

    $scope.$watchCollection('inputTags', function(
      newInputTags ) {
        //oldInputTags, scope
        var tags = {};
        angular.forEach( newInputTags, function( inputTag ) {
          tags[inputTag.text] = inputTag.text;
        });
        story.tags = tags;
      });

    $scope.inputInvitedUsers = undefined;
    $scope.loadUserList = function( query ) {
      return UserService.userList( query ); // returns a promise to get an array of strings corresponding to users in the system
    };

    $scope.$watchCollection('inputInvitedUsers', function(
      newInputInvitedUsers ) {
        var invitedUsers = {};
        angular.forEach( newInputInvitedUsers, function( inputUser ) {
          invitedUsers[inputUser.userId] = inputUser.text;
        });
        story.invitedUsers = invitedUsers;
      });

  });
