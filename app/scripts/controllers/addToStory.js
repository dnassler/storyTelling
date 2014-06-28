'use strict';

angular.module('storyApp')
  .controller('AddToStoryController', function($scope, syncData, StoryService, $stateParams, $state, UserService, TagsService) {

  console.log('Inside AddToStoryController...');
  console.log('$stateParams.storyId:',$stateParams.storyId);
  // console.log(StoryService.getStory( storyId ));
  //$scope.story = StoryService.getStoryItem();

  var storyId = $stateParams.storyId;

  var story = StoryService.getStory( $stateParams.storyId );
  $scope.story = story;

  $scope.$watchCollection('inputTags', function(
    newInputTags ) {
      var tags = {};
      angular.forEach( newInputTags, function( inputTag ) {
        tags[inputTag.text] = inputTag.text;
      });
      if ( $scope.storyInfoEdit ) {
        $scope.storyInfoEdit.tags = tags;
      }
    });
  $scope.loadTags = function( query ) {
    // return TagsService.getTagsMatching( query );
    console.log('query = ', query);
    return TagsService.getTagsMatching(query);
  };

  $scope.storyTagsForReadOnlyDisplay = function() {
    var tags = [];
    angular.forEach( story.tags, function(tag) {
      tags.push( '#'+tag );
    });
    return tags.join(' ');
  };


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
      if ( $scope.storyInfoEdit ) {
        $scope.storyInfoEdit.invitedUsers = invitedUsers;
      }
    });
  $scope.invitedUsersReadOnlyDisplay = function() {
    var invitedUsers = [];
    angular.forEach( story.invitedUsers, function( invitedUser ) {
      invitedUsers.push( invitedUser );
    });
    return invitedUsers.join(' ');
  };

  //$scope.story.title = $stateParams.storyTitle;
  $scope.nextStoryContentItem = {text: ''};
  $scope.storyContent = $scope.story.$child('content');

  $scope.saveNewStoryContentItem = function() {
    StoryService.addStoryContentItem( storyId, $scope.story, $scope.nextStoryContentItem );
    $scope.nextStoryContentItem = {text: ''};
  };
  $scope.cancelStoryContent = function() {
    $state.go('main');
  };

  $scope.editStory = function() {
    $scope.isEditingStoryInfo = true;
    $scope.storyInfoEdit = {title:$scope.story.title, idea:$scope.story.idea, tags:$scope.story.tags};

    var inputTags = [];
    angular.forEach( story.tags, function(tag) {
      inputTags.push({text: tag});
    });
    $scope.inputTags = inputTags;

    var inputInvitedUsers = [];
    angular.forEach( story.invitedUsers, function(invitedUser, userId) {
      inputInvitedUsers.push({text: invitedUser, userId: userId});
    });
    $scope.inputInvitedUsers = inputInvitedUsers;

  };
  $scope.deleteStory = function() {
    //$scope.story.$remove();
    StoryService.deleteStory( storyId );
    $state.go('main');
  };
  $scope.commitStoryInfoChanges = function() {
    StoryService.updateStoryInfo( storyId, $scope.storyInfoEdit );
    $scope.isEditingStoryInfo = false;
  };
  $scope.cancelStoryInfoChanges = function() {
    $scope.isEditingStoryInfo = false;
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
  $scope.branchStory = function( storyContentItemId ) {
    $scope.currentBranch = StoryService.newStoryBranch( $scope.story, storyContentItemId );
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
  $scope.userAvatarURL = function(userId) {
    return UserService.userAvatarURL( userId );
  };
  $scope.userDisplayName = function(userId) {
    return UserService.userDisplayName( userId );
  };
  // $scope.story = {
  //   title: '',
  //   idea: '',
  //   tags: ''
  // };

});
