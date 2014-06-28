'use strict';

angular.module('storyApp')
  .factory('TagsService', function (syncData, filterFilter, $q) {
    var tags = syncData('tags');
    var tagsTest1 = ['derek','trevor','jean','john','linda'];
    var f = {
      getTagsMatching: function( query ) {
        console.log('getTagsMatching: tags=',tags);
        var tagArr = tags.$getIndex();
        var filtered = filterFilter( tagArr, query );
        var d = $q.defer();
        d.resolve( filtered );
        return d.promise;
        //return filterFilter( tags, query );
      },
      getTagsTest: function( query ) {
        var d = $q.defer();
        var filtered = filterFilter( tagsTest1, query );
        d.resolve( filtered );
        return d.promise;
      },
      updateTagsForStory: function( storyId, newTags, oldTags ) {
        //console.log('updateTagsForStory: storyId=',storyId);
        //var tagsToRemove = f.getTagsForStoryId( storyId );
        if ( oldTags ) {
          angular.forEach( oldTags, function( tag ) {
            tags.$child(tag).$remove(storyId);
          });
        }
        angular.forEach( newTags, function( tag ) {
          var tObj = tags.$child(tag);
          tObj.$child( storyId ).$set(1);
        });
      },
      deleteTagsForStory: function( storyId, oldTags ) {
        angular.forEach( oldTags, function( tag ) {
          tags.$child(tag).$remove(storyId);
        });
      }
      // getTagsForStoryId: function( storyId ) {
      //   var story = syncData('stories').$child(storyId);
      //   return story.$child('tags').$getIndex();
      // }
    };
    return f;
  });
