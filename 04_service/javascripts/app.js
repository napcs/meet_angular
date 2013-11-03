var FlickrSearch  = angular.module("FlickrSearch", []);

// Incorporate 
FlickrSearch.service("PhotoSearch", ["$http", "FeedParser",  function($http, FeedParser){
  this.findAllByKeyword = function(query){
    query = encodeURIComponent(query);
    var flickrURL = 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=' + query + '&jsoncallback=JSON_CALLBACK'; 
    return ($http.jsonp(flickrURL, {
      transformResponse: function(data){
        return FeedParser.parse(data);
      }
    }));
  };
}]);

// Parses the feed results into a more managable object.
FlickrSearch.service("FeedParser", function(){
  this.parse = (function(data){
    var results = []; 
    for(var i = 0; i < data.items.length; i++){
      var result = {};
      result.image = (data.items[i].media.m);
      result.link = data.items[i].link;
      result.description = data.items[i].description;
      result.title = data.items[i].title;
      results.push(result);
    }
    return(results);
  });
});

FlickrSearch.controller(
  "MainCtrl", ["$scope", "PhotoSearch",  function($scope, PhotoSearch){
    $scope.message = "Enter a keyword.";
    
    $scope.search = function(){
      PhotoSearch.findAllByKeyword($scope.keyword).then(function(response){
        $scope.results = response.data;
      }, function(){
        $scope.results = [];
        $scope.message = "There was an error.";
      });
    }
  }]
);

