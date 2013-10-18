var FlickrSearch  = angular.module("FlickrSearch", []);


FlickrSearch.controller(
  "MainCtrl", ["$scope", "$http", function($scope, $http){
    $scope.message = "Enter a keyword.";
    
    $scope.search = function(){
      var query = encodeURIComponent($scope.keyword);
      var flickrURL = 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=' 
        + query + '&jsoncallback=JSON_CALLBACK'; 

      $http.jsonp(flickrURL).then(function(response){
        var data = response.data;
        console.log(response);
        var results = []; 
        for(var i = 0; i < data.items.length; i++){
          var result = {};
          result.image = (data.items[i].media.m);
          result.link = data.items[i].link;
          result.description = data.items[i].description;
          result.title = data.items[i].title;
          results.push(result);
        }
        $scope.results = results;
      }, function(){
        $scope.results = [];
        $scope.message = "There was an error.";
      });
    }
  }]
);

