'use strict';

angular.module('storyApp')
  .factory('UserService', function( syncData, filterFilter, $q ) {

    var users = syncData('users');

    var factory = {

      userAvatarURL: function( userId ) {
        if ( !userId || userId.indexOf(':') === -1 ) {
          return null;
        }
        var info = userId.split(':');
        var provider = info[0];
        var id = info[1];
        if ( provider === 'facebook' ) {
          return 'https://graph.facebook.com/' + id + '/picture?type=square';
        } else if ( provider === 'twitter' ) {
          return 'http://twitter.com/api/users/profile_image/' + id + '?size=normal';
        }
        return null;
      },

      userDisplayName: function( userId ) {
        if ( !userId ) {
          return null;
        }
        var user = users[userId];
        if ( user ) {
          if ( user.displayName ) {
            return user.displayName;
          } else if ( user.name ) {
            return user.name;
          }
        }
        return null;
      },

      userList: function( query ) {
        //var userListArr = users.$getIndex();

        var userListArr = [];

        angular.forEach( users.$getIndex(), function( userId ) {
          var userDisplayName;
          var user = users[userId];
          if ( user.displayName ) {
            // if ( userListArr.indexOf(user.displayName) !== -1 ) {
            //   var count = userListArr.filter(function(name){ return name === user.displayName; }).length + 1;
            //   userDisplayName = user.displayName + '-' + count;
            // } else {
            //   userDisplayName = user.displayName;
            // }
            userDisplayName = user.displayName;
          } else if ( user.name ) {
            userDisplayName = user.name;
          } else {
            userDisplayName = user.uid;
          }
          userListArr.push( {text:userDisplayName, userId:userId} );
        });
        var filtered = filterFilter( userListArr, query );
        var d = $q.defer();
        d.resolve( filtered );
        return d.promise;
      }


    };
    return factory;
  });
