'use strict';

angular.module('storyApp')
  .controller('InboxController', function($scope, $rootScope, $state, StoryService, waitForAuth) {

    $scope.storyClicked = function(storyId) {
      console.log('storyItem clicked!!!!');
      console.log('storyId = ', storyId);
      //$location.path('addToStory');
      //StoryService.setStoryItem(storyItem);
      $state.go('addToStory', {storyId: storyId});
    };


    var storiesInboxIds;

    waitForAuth.then(function() {
      var user = $rootScope.currentUser();
      if ( user ) {
        storiesInboxIds = StoryService.inboxStoryIds( user.uid );

        //populateInboxFromIds();

        storiesInboxIds.$on('child_added', function(childSnapshot) {
          var storyId = childSnapshot.snapshot.name;
          $scope.storiesInbox[storyId] = StoryService.getStoryById( storyId );
        });

        storiesInboxIds.$on('child_removed', function(childSnapshot) {
          var storyId = childSnapshot.snapshot.name;
          delete $scope.storiesInbox[storyId];
        });

        $scope.storiesInbox = {};

      }
    });

    $scope.hasStoriesInInbox = function() {
      return $scope.storiesInbox && Object.keys($scope.storiesInbox).length > 0;
    };

    $scope.isStoryUndecided = function( storyId ) {
      var user = $rootScope.currentUser();
      return StoryService.userStoryStatusIsUndecided( storyId, user.uid );
    };

    $scope.isStoryAccepted = function( storyId ) {
      var user = $rootScope.currentUser();
      return StoryService.userStoryStatusIsAccepted( storyId, user.uid );
    };

    $scope.acceptStoryInvite = function( storyId ) {
      var user = $rootScope.currentUser();
      StoryService.acceptStoryInvite( storyId, user.uid );
    };

    $scope.isStoryDeclined = function( storyId ) {
      var user = $rootScope.currentUser();
      return StoryService.userStoryStatusIsDeclined( storyId, user.uid );
    };

    $scope.declineStoryInvite = function( storyId ) {
      var user = $rootScope.currentUser();
      StoryService.declineStoryInvite( storyId, user.uid );
    };

    $scope.dismissStoryFromInbox = function( storyId ) {
      var user = $rootScope.currentUser();
      StoryService.dismissStoryFromInbox( storyId, user.uid );
    };

    $scope.isUsersTurn = function( storyId ) {
      if ( !storyId ) {
        return false;
      }
      var user = $rootScope.currentUser();
      return StoryService.isUsersTurn( storyId, user.uid );
    };
    $scope.isFinished = function( storyId ) {
      return StoryService.isFinished( $scope.storiesInbox[storyId] );
    };

    // function populateInbox() {
    //   angular.forEach($scope.user.posts, function(postId) {
    //     $scope.posts[postId] = Post.find(postId);
    //   });
    // }

    // function populateComments() {
    //   $scope.comments = {};
    //
    //
    //   angular.forEach($scope.user.comments, function (comment) {
    //     var post = Post.find(comment.postId);
    //     post.$on('loaded', function () {
    //       $scope.comments[comment.id] = post.$child('comments').$child(comment.id);
    //
    //       $scope.commentedPosts[comment.postId] = post;
    //     });
    //   });
    // }

    // $scope.user.$on('loaded', function () {
    //   populateInbox();
    //   //populateComments();
    // });


  });
