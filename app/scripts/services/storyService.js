'use strict';

angular.module('storyApp')
  .factory('StoryService', function (syncData, simpleLogin) {
    //var storiesRef = firebaseRef('stories');
    var storiesSync = syncData('stories');
    //var _storyItem;
    return {
      //storiesRef: storiesRef,
      // isStoryNameUnique : function (name) {
      //   //firebaseRef.once('value', function(dataSnapshot) { /* handle read data. */ });
      //   //if ( storiesRef[name] )
      //   // console.log(storiesRef | json)
      //   return true;
      // }
      addStory: function (storyInfo) {
        console.log('***addStory');
        var user = simpleLogin.currentUser();
        if ( user ) {
          storyInfo.userUid = user.uid;
        }
        console.log(storyInfo);
        storiesSync.$add( storyInfo ).then(function(ref) {
          console.log('ref.name()='+ref.name());
          //console.log('ref = ', $filter('json').(ref));
        });
      },
      addStoryContentItem: function( story, contentItem ) {
        var user = simpleLogin.currentUser();
        if ( user ) {
          contentItem.userUid = user.uid;
        }
        story.$child('content').$add( contentItem );
      },
      saveContentItem: function( story, contentItemId, contentItem ) {
        var user = simpleLogin.currentUser();
        if ( user ) {
          contentItem.userUid = user.uid;
        }
        story.$child('content').$child( contentItemId ).$set( contentItem );
      },
      deleteContentItem: function( story, contentItemId ) {
        story.$child('content').$remove( contentItemId );
      },
      currentUser: function() {
        return simpleLogin.currentUser();
      },
      signedIn: function() {
        return simpleLogin.signedIn();
      },
      getStory: function( storyId ) {
        return storiesSync.$child(storyId);
      },
      isUserStoryOwner: function( storyId, user ) {
        var storyUserUid = storiesSync.$child(storyId).userUid;
        var userUid = user.uid;
        return storyUserUid === userUid;
      },
      deleteStory: function( storyId ) {
        var story = storiesSync.$child(storyId);
        console.log('deleteStory: story.title=',story.title);
        story.$remove();
      }

      // setStoryItem: function(storyItem) {
      //   _storyItem = storyItem;
      // },
      // getStoryItem: function() {
      //   return _storyItem;
      // }
    };

  });
