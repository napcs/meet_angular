var FlickrSearch  = angular.module("FlickrSearch", []);

FlickrSearch.controller(
  "MainCtrl", ["$scope", function($scope){
    $scope.message = "Enter a keyword.";
    
    $scope.search = function(){
      $scope.results = ["One", "Two", "Three"];
    }

  }]
);

