'use strict';

angular.module('storyApp')
  .controller('MainCtrl', function ($rootScope, $scope, StoryService, syncData, $location, $state) {

    $scope.searchStories = ''; // search

    $scope.storyClicked = function(storyId) {
      console.log('storyItem clicked!!!!');
      console.log('storyId = ', storyId);
      //$location.path('addToStory');
      //StoryService.setStoryItem(storyItem);
      $state.go('addToStory', {storyId: storyId});
    };

    $scope.story = {
      title: '',
      idea: '',
      tags: ''
    };

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
    };

    $scope.cancelStory = function() {
      console.log('cancelStory');
      clearStory();
    };

    function clearStory() {
      $scope.story.title = '';
      $scope.story.idea = '';
      $scope.story.tags = '';
    }

    // $scope.stories = syncData('messages');
    // $scope.all = syncData();
    // $scope.x3 = syncData('x3');

    $scope.stories = syncData('stories');
    // $scope.addStory = function (storyInfo) {
    //   console.log('***addStory');
    //   $scope.stories.$add( storyInfo ).then(function(ref) {
    //     console.log('ref.name() = ', ref.name());
    //   });
    // };

    $scope.whatIsTheFuckingUser = function() {
      // return StoryService.currentUser();
      return $rootScope.currentUser();
    };
    $scope.isSignedIn = function() {
      // return StoryService.signedIn();
      return $rootScope.signedIn();
    };
    $scope.isOwner = function( storyId ) {
      var user = $rootScope.currentUser();
      if ( user ) {
        return StoryService.isUserStoryOwner( storyId, $rootScope.currentUser() );
      }
      return false;
    };
    $scope.deleteStory = function( storyId ) {
      StoryService.deleteStory( storyId );
    };

  });
