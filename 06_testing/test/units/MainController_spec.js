describe('MainCtrl', function(){
  var deferred, q, photosearch, scope; 

  //mock FlickrSearch so we can inject our own dependencies
  beforeEach(module('FlickrSearch'));

  //mock the controller for the same reason and 
  // and include $rootScope and $controller
  beforeEach(inject(function($rootScope, $controller, $q){

    //create an empty scope
    scope = $rootScope.$new();

    // create a local version of q that can be passed
    // around in all tests.
    q = $q;

    // Create a mock photosearch object
    photosearch  = {
      findAllByKeyword: function (query) {
        deferred = q.defer();

        result = {data: [
          {"title": "One", "image": "foo.jpg"},
          {"title": "Two", "image": "bar.jpg"}
        ]};
       
        // make the photosearch send our result
        // object back
        deferred.resolve(result);
        return deferred.promise;
      }
    };

    //declare the controller and inject the scope and our Mock
    $controller('MainCtrl', {$scope: scope, PhotoSearch: photosearch});
  }));


  it("should fetch two photos", function(){

    // method call on the scope
    scope.search("test");

    // promises are not resolved until
    // // the scope is applied.
    scope.$apply();

    // The actual test
    expect(scope.results.length).toBe(2);
  }); 
});
