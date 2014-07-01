'use strict';
angular.module('angularfire.login', ['firebase', 'angularfire.firebase'])

  .run(function(simpleLogin) {
    simpleLogin.init();
  })

  .factory('simpleLogin', function($rootScope, $firebaseSimpleLogin, firebaseRef, profileCreator, $timeout) {
    function assertAuth() {
      if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
    }
    $rootScope.currentUser = function() {
      return auth ? auth.user : null;
    };
    $rootScope.signedIn = function() {
      // console.log('111111111 $rootScope.currentUser=',$rootScope.currentUser);
      // console.log('222222222 $rootScope.currentUser !== null value is ',$rootScope.currentUser !== null);
      // return ($rootScope.currentUser !== null && $rootScope.currentUser !== undefined);
      return $rootScope.currentUser() !== null;
    };
    var auth = null;
    return {
      init: function() {
        console.log('login service: init');
        auth = $firebaseSimpleLogin(firebaseRef());
        console.log('auth = ', auth);
        $rootScope.$on('$firebaseSimpleLogin:login', function() {
          console.log('$firebaseSimpleLogin:login event from login service init');
        });
        $rootScope.$on('$firebaseSimpleLogin:logout', function() {
          console.log('$firebaseSimpleLogin:logout event from login service init');
        });
        $rootScope.$on('$firebaseSimpleLogin:error', function() {
          console.log('$firebaseSimpleLogin:error event from login service init');
        });
        return auth;
      },

      logout: function() {
        assertAuth();
        auth.$logout();
        //$rootScope.currentUser =  null;
      },

      /**
       * @param {string} provider
       * @param {Function} [callback]
       * @returns {*}
       */
      login: function(provider, callback) {
        assertAuth();
        auth.$login(provider, {rememberMe: true}).then(function(user) {

          profileCreator.oauthLogin( user ); // create a profile only if necessary in the /users location

          if( callback ) {
            //todo-bug https://github.com/firebase/angularFire/issues/199
            $timeout(function() {
              callback(null, user);
            });
          }

          //$rootScope.currentUser = user;
        }, callback);
      },


      /**
       * @param {string} email
       * @param {string} pass
       * @param {Function} [callback]
       * @returns {*}
       */
      loginPassword: function(email, pass, callback) {
        assertAuth();
        auth.$login('password', {
          email: email,
          password: pass,
          rememberMe: true
        }).then(function(user) {
            if( callback ) {
              //todo-bug https://github.com/firebase/angularFire/issues/199
              $timeout(function() {
                callback(null, user);
              });
            }
            //$rootScope.currentUser = user;
          }, callback);
      },

      changePassword: function(opts) {
        assertAuth();
        var cb = opts.callback || function() {};
        if( !opts.oldpass || !opts.newpass ) {
          $timeout(function(){ cb('Please enter a password'); });
        }
        else if( opts.newpass !== opts.confirm ) {
          $timeout(function() { cb('Passwords do not match'); });
        }
        else {
          auth.$changePassword(opts.email, opts.oldpass, opts.newpass)
            .then(function() { cb(null); }, cb);
        }
      },

      createAccount: function(email, pass, callback) {
        assertAuth();
        auth.$createUser(email, pass).then(
          function(user) {
            callback(null, user);
          }, callback);
      },

      createProfile: profileCreator.passwordLogin,

      currentUser: function() {
        console.log('currentUser:');
        if ( auth ) {console.log(auth.user);}
        return auth ? auth.user : null;
      },
      signedIn: function() {
        console.log('login service: signedIn()=',auth!==null);
        return auth ? auth.user !== null : false;
      }
    };
  })
  .factory('profileCreator', function(firebaseRef, syncData, $timeout) {
    return {

      oauthLogin: function( user ) {

        var users = syncData('users');
        users.$child(user.uid).$update(user);

        // firebaseRef('users/'+user.uid).set(user, function(err) {
        //   //err && console.error(err);
        //   if( callback ) {
        //     $timeout(function() {
        //       callback(err);
        //     });
        //   }
        // });

      },

      passwordLogin: function(id, email, callback) {

        function firstPartOfEmail(email) {
          return ucfirst(email.substr(0, email.indexOf('@'))||'');
        }

        function ucfirst (str) {
          // credits: http://kevin.vanzonneveld.net
          str += '';
          var f = str.charAt(0).toUpperCase();
          return f + str.substr(1);
        }

        firebaseRef('users/'+id).set({email: email, name: firstPartOfEmail(email)}, function(err) {
          //err && console.error(err);
          if( callback ) {
            $timeout(function() {
              callback(err);
            });
          }
        });
      }

    };

  });
