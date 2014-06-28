'use strict';

angular.module('storyApp')
  .factory('StoryService', function (syncData, simpleLogin, TagsService, UserService) {
    //var storiesRef = firebaseRef('stories');
    var storiesSync = syncData('stories');
    var inbox = syncData('inbox');

    //var _storyItem;
    var searchFields = {
      searchStories: '',
      searchBy: 'title',
      filterBy: 'allStories',
      storyStatus: 'inProgress'
    };
    var factory = {
      searchFields: searchFields,
      //storiesRef: storiesRef,
      // isStoryNameUnique : function (name) {
      //   //firebaseRef.once('value', function(dataSnapshot) { /* handle read data. */ });
      //   //if ( storiesRef[name] )
      //   // console.log(storiesRef | json)
      //   return true;
      // }
      getStoryById: function( storyId ) {
        return storiesSync.$child( storyId );
      },
      addStory: function (storyInfo) {
        //console.log('***addStory');
        var user = simpleLogin.currentUser();
        if ( user ) {
          storyInfo.userUid = user.uid;
        }
        //console.log(storyInfo);
        var inbox = syncData('inbox');
        var tags = storyInfo.tags;
        storiesSync.$add( storyInfo ).then(function(ref) {
          //console.log('ref.name()='+ref.name());
          //console.log('ref = ', $filter('json').(ref));
          // add to the /tags location that indexes all of the stories that use each tag
          var storyId = ref.name();

          //storiesSync.$child(storyId).$child('status').$child('waitingForUser').$set( user.uid );

          TagsService.updateTagsForStory( storyId, tags );
          angular.forEach( storyInfo.invitedUsers, function(userName,userId) {
            if ( !inbox[userId] || !inbox[userId].hasOwnProperty(storyId) ) {
              if ( userId === user.uid ) {
                // this invited user is the user him/herself that created the story so
                // set the accepted status rather than the default of 'undecided'
                factory.acceptStoryInvite( storyId, userId, true );
                // var story = factory.getStory(storyId);
                // var userDisplayName = UserService.userDisplayName( userId );
                // story.$child('usersAccepted').$child(userId).$set( userDisplayName );
                // inbox.$child(userId).$child(storyId).$set({status:'accepted'});
              } else {
                inbox.$child(userId).$child(storyId).$set({status:'undecided'});
              }
            }
          });

          //factory.nextTurn( storyId );

        });
      },
      updateStoryInfo: function(storyId, newStoryInfo) {
        var oldTags = storiesSync.$child(storyId).$child('tags').$getIndex();
        var inbox = syncData('inbox');
        var newTags = newStoryInfo.tags;
        storiesSync.$child(storyId).$update(newStoryInfo).then(function() {
          // add/update to the /tags location that indexes all of the stories that use each tag

          TagsService.updateTagsForStory( storyId, newTags, oldTags );

          angular.forEach( newStoryInfo.invitedUsers, function(userName,userId) {
            if ( !inbox[userId] || !inbox[userId].hasOwnProperty(storyId) ) {
              inbox.$child(userId).$child(storyId).$set({status:'undecided'});
            }
          });

        });

      },
      addStoryContentItem: function( storyId, story, contentItem ) {
        var user = simpleLogin.currentUser();
        if ( user ) {
          contentItem.userUid = user.uid;
        }
        story.$child('content').$add( contentItem );
        // story.$child('status').$child('waitingForUser').$set( contentItem.userId ).then(function(){
        //   factory.nextTurn( storyId )
        // });

        factory.nextTurn( storyId );

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
        var oldTags = story.$child('tags').$getIndex();
        console.log('deleteStory: story.title=',story.title);
        story.$remove().then(function() {
          TagsService.deleteTagsForStory( storyId, oldTags );
          factory.deleteInboxStoryId(storyId);
        });
        // *** needs to remove the storyId from the /tags 'index' as well
      },
      isFinished: function( story ) {
        // if ( story.content ) {
        //   console.log('isFinished: ', Object.keys(story.content).length );
        // }
        if ( story.content && Object.keys(story.content).length === 5 ) {
          return true;
        }
        return false;
      },
      isInProgress: function( story ) {
        return !factory.isFinished( story );
      },

      inboxStoryIds: function( userId ) {
        var inboxIdsForUser = syncData('inbox/' + userId);
        return inboxIdsForUser;
      },


      // inbox related

      deleteInboxStoryId: function( storyId ) {
        console.log('deleteInboxStoryId: storyId = ',storyId);
        angular.forEach( inbox.$getIndex(), function(userId) {
          if ( inbox[userId].hasOwnProperty(storyId) ) {
            console.log('userId = ', userId);
            inbox.$child(userId).$remove(storyId);
          }
        });
      },

      dismissStoryFromInbox: function( storyId, userId ) {
        inbox.$child(userId).$remove(storyId);
      },

      acceptStoryInvite: function( storyId, userId, doNotInvokeNextTurn ) {
        var story = factory.getStory( storyId );
        var userDisplayName = UserService.userDisplayName( userId );
        story.$child('usersAccepted').$child(userId).$set( userDisplayName );
        inbox.$child(userId).$child(storyId).$set({status:'accepted'});

        if ( doNotInvokeNextTurn ) {
          return;
        }

        if ( !story.status || !story.status.waitingForUser ) {
          factory.nextTurn( storyId );
        }
      },

      declineStoryInvite: function( storyId, userId ) {
        var story = factory.getStory( storyId );
        var userDisplayName = UserService.userDisplayName( userId );
        story.$child('usersDeclined').$child(userId).$set( userDisplayName );
        inbox.$child(userId).$child(storyId).$set({status:'declined'});
      },

      userStoryStatusIsUndecided: function( storyId, userId ) {
        var inboxInfoForUser = inbox[userId];
        var storyInfo = inboxInfoForUser ? inboxInfoForUser[storyId] : null;
        if ( storyInfo ) {
          return storyInfo.status === 'undecided';
        }
        return null;
      },

      userStoryStatusIsAccepted: function( storyId, userId ) {
        var inboxInfoForUser = inbox[userId];
        var storyInfo = inboxInfoForUser ? inboxInfoForUser[storyId] : null;
        if ( storyInfo ) {
          return storyInfo.status === 'accepted';
        }
        return null;
      },

      userStoryStatusIsDeclined: function( storyId, userId ) {
        var inboxInfoForUser = inbox[userId];
        var storyInfo = inboxInfoForUser ? inboxInfoForUser[storyId] : null;
        if ( storyInfo ) {
          return storyInfo.status === 'declined';
        }
        return null;
      },

      isUsersTurn: function( storyId, userId ) {
        var story = factory.getStory( storyId );
        if ( story.status && story.status.waitingForUser && story.status.waitingForUser === userId ) {
          return true;
        }
        return false;
      },

      nextTurn: function( storyId ) {
        var story = factory.getStory( storyId );
        if ( !story.usersAccepted || Object.keys(story.usersAccepted).length === 0 ) {
          return null; // there is no next user since there is nobody in the accepted list of users
        }

        var userIdsAccepted = story.$child('usersAccepted').$getIndex();
        var usersAcceptedCount = story.$child('usersAccepted').$getIndex().length;
        var nextUserId, r, nextIndexAcceptedUser;

        if ( !story.status || !story.status.waitingForUser ) {
          // get the last content item user
          if ( !story.content || Object.keys(story.content).length === 0 ) {
            r = Math.floor(Math.random() * usersAcceptedCount);
            nextUserId = userIdsAccepted[r];
          } else {
            var contentItemIds = story.$child('content').$getIndex();
            var lastContentItemIndex = contentItemIds.length - 1;
            var lastContentItemId = contentItemIds[lastContentItemIndex];
            var lastContentItem = story.content[lastContentItemId];
            var lastContentItemUserId = lastContentItem.userId;

            var indexOfLastContentUserIdInAcceptedList = userIdsAccepted.indexOf(lastContentItemUserId);
            if ( indexOfLastContentUserIdInAcceptedList === -1 ) {
              nextUserId = userIdsAccepted[0];
            } else {
              nextIndexAcceptedUser = (indexOfLastContentUserIdInAcceptedList + 1) % usersAcceptedCount;
              nextUserId = userIdsAccepted[nextIndexAcceptedUser];
            }
          }

        } else {

          var indexOfWaitingForUserInAcceptedList = userIdsAccepted.indexOf( story.status.waitingForUser );
          if ( indexOfWaitingForUserInAcceptedList === -1 ) {
            r = Math.floor(Math.random() * usersAcceptedCount);
            nextUserId = userIdsAccepted[r];
          } else {
            nextIndexAcceptedUser = (indexOfWaitingForUserInAcceptedList + 1) % usersAcceptedCount;
            nextUserId = userIdsAccepted[nextIndexAcceptedUser];
          }

        }

        story.$child('status').$child('waitingForUser').$set( nextUserId );

      }

      // setStoryItem: function(storyItem) {
      //   _storyItem = storyItem;
      // },
      // getStoryItem: function() {
      //   return _storyItem;
      // }
    };

    return factory;

  });
