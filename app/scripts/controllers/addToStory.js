'use strict';

angular.module('storyApp')
  .controller('AddToStoryController', function($scope, syncData, StoryService, $stateParams, $state) {

  console.log('Inside AddToStoryController...');
  console.log('$stateParams.storyId:',$stateParams.storyId);
  // console.log(StoryService.getStory( storyId ));
  //$scope.story = StoryService.getStoryItem();
  $scope.story = StoryService.getStory( $stateParams.storyId );
  //$scope.story.title = $stateParams.storyTitle;
  $scope.nextStoryContentItem = {text: ''};
  $scope.storyContent = $scope.story.$child('content');
  $scope.saveNewStoryContentItem = function() {
    StoryService.addStoryContentItem( $scope.story, $scope.nextStoryContentItem );
    $scope.nextStoryContentItem = {text: ''};
  };
  $scope.cancelStoryContent = function() {
    $state.go('main');
  };
  $scope.storyContentEmpty = function() {
    var keys = $scope.storyContent.$getIndex();
    console.log('keys.length = ',keys.length);
    if ( keys.length === 0 ) {
      return true;
    }
    return false;
  };
  $scope.deleteStoryContentItem = function( storyContentItemId ) {
    console.log('deleteStoryContentItem...',storyContentItemId);
    //$scope.storyContent.$child(storyContentItemId).$remove();
    StoryService.deleteContentItem( $scope.story, storyContentItemId );
  };
  $scope.editStoryContentItem = function( storyContentItemId, storyContentItem ) {
    console.log('storyContentItemId=',storyContentItemId);
    $scope.editingContentId = storyContentItemId;
    $scope.storyContentItemEdit = {text: storyContentItem.text};//angular.copy( storyContentItem );
  };
  $scope.branchStory( storyContentItemId ) {
    //$scope.currentBranch = StoryService.newStoryBranch( $scope.story, storyContentItemId );
  };
  $scope.storyContentItemEditCommit = function() {
    StoryService.saveContentItem( $scope.story, $scope.editingContentId, $scope.storyContentItemEdit);
    $scope.editingContentId = null;
  };
  $scope.storyContentItemEditCancel = function() {
    $scope.editingContentId = null;
  };
  $scope.isStoryFinished = function() {
    var keys = $scope.storyContent.$getIndex();
    if ( keys.length >= 5 ) {
      return true;
    }
    return false;
  };

  // $scope.story = {
  //   title: '',
  //   idea: '',
  //   tags: ''
  // };

});
