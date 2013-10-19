# Meet Angular.js

Angular is a web development framework from Google. There are a lot of definitions out there for what it is, but I like to think of it as an opinionated framework for creating both simple and complex CRUD applications. Angular isn't for everyone, and it isn't for every project, but if you thought that Knockout was great but lacked structure, and you thought that Backbone was too minimal, then you might find Angular to be exactly what you're looking for.

Let's look at exactly what Angular is all about. Angular lets models, which are nothing more than simple JavaScript objects, interact with views, which are just simple HTML pages. This data binding can be bi-directional, and Angular has Controllers which can prepare the models and interact with the views and services. In addition, Angular has services, factories, and providers, which are ways of encapsulating business logic, and **directives**, which let us create our own elements and attributes to make our views much, much cleaner.

We'll take a tour of these things as we create a very simple app that searches Flickr's public photo stream. With this example project, we'll be able to explore data binding, services, controllers, directives, and how we interact with external services.

## Getting Started

To start, we need a simple web project folder. Create the following file structure:

~~~plain
flickrsearch/
  javascripts/
    app.js
  lib/
    angular.min.js
  index.html
~~~

If you're comfortable using  the Terminal, you can create these folders and files quickly:

~~~bash
$ mkdir -p flickrsearch/javascripts
$ mkdir flickrsearch/lib
$ touch flickrsearch/index.html
$ touch flickrsearch/javascripts/app.js
$ cd flickrsearch
~~~

Next, download AngularJS from <http://code.angularjs.org/1.0.8/angular.min.js> and place it in your `lib/` folder.

You can also get it with cURL:

`curl http://code.angularjs.org/1.0.8/angular.min.js > lib/angular.min.js`


Now let's create the `index.html` file using a very simple HTML template.

~~~html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Flickr Search</title>
  </head>

  <body ng-app>
    <div class="wrapper">
      
    </div>

    <script src="lib/angular.min.js"></script>
    <script src="javascripts/app.js"></script>
    
  </body>
</html>
~~~

At first glance, this looks like any old HTML5 template. We've added in two `<script>` tags at the bottom; the first loads the AngularJS library itself, and the next one loads our `app.js` file which will hold our application's code.

However, this line:

~~~html
  <body ng-app>
~~~

is a little bit less standard. The `ng-app` attribute here is what sets up an Angular application. AngularJS scans the page and looks for the section of the page that contains this attribute. Then this element, and all its child elements, become part of an Angular application. 

With our application in place, let's look at Angular's simple data binding features.

## Simple Data Binding 

Angular's built-in data binding is incredibly easy to set up. To illustrate what it is and how it works, let's create a simple search form:

~~~html
<label for="search">Search Flickr</label>
<input id="search" 
       name="search" 
       placeholder="Enter Keyword" 
       autofocus 
       ng-model="keyword">
<p>You searched for {{keyword}}</p>  
~~~

Here we have a label and an input field, followed by a paragraph tag. The input field uses the `ng-model` directive which turns this field into a data model that can be bound to other elements.  

Now, when we load the page in the web browser and type a keyword into the text box, the keyword displays in the paragraph. 

Let's change the `{{keyword}}` part though. There's a much cleaner approach. We'll replace the `{{keyword}}` part
with a `<span>` and use Angular's `ng-bind` attribute.

~~~
<p>You searched for <span ng-bind="keyword"></span>.</p>
~~~


Data binding in Angular is as simple as this - by changing the model (the "keyword" text field) we can change the bound element.

Of course, this is hardly useful as it stands now, so let's do someting more useful with Angular's data binding, by adding a Controller into the mix.

## Working With Modules and Controllers

When we defined our input field using the `ng-model` directive:

~~~html
<input id="search" 
       name="search" 
       placeholder="Enter Keyword" 
       autofocus 
       ng-model="keyword">
~~~


What we were really doing is saying that the `value` attribute of the `input` field should be bound to a variable called `keyword`. But where's this variable stored? Is it on the Window object?

Nope, it's actually on an object called `$scope`. The `keyword` variable is a `property` of this `$scope` object. And things are going to get pretty messy if we just start throwing things into this `$scope` object from our views, so we need a place to handle all of the code that's behind this view. That's where controllers come into play.

To create a simple controller, we need to create a JavaScript function that takes in a single argument - the scope. 

So, in `javascripts/app.js`, add the following:

~~~javascript
function MainCtrl($scope){
  $scope.message = "Enter a keyword.";
}
~~~

In this controller, we take the `$scope` in, and we add a `message` property onto the scope, giving it a value. We're going to then use this value on the page.

To use this new controller, we have to make a few changes to our page.

First, we bind the controller to the `wrapper` element of our page using the `ng-controller` attribute:

~~~html
<div class="wrapper" ng-controller="MainCtrl">
  ...omitted for brevity
</div>
~~~

Then, right below the opening `<div>` tag, let's add in a new paragraph that displays the value of the `message` property we added onto the scope:

~~~
<p ng-bind="message"></p>
~~~

When we load the page, the message appears. We've used the controller to set a variable. In addition, the value we type into the textbox is available in the controller, and we'll need that soon when we begin processing records.

### Modules

This method we used to create a controller is nice for simple examples, but this example is going to get more complex shortly, so we're going to modify our code to use the more proper "Angular" approach. Instead of just creating simple functions, we'll use an Angular Module, and then create these controllers as part of that module. This will also help to keep our default namespace clean.

In `javascripts/app.js`, at the very top of the file, create a new module, like this:

~~~javascript
var FlickrSearch  = angular.module("FlickrSearch", []);
~~~

Then, rewrite the controller so it looks like this:

~~~
FlickrSearch.controller(
  "MainCtrl", ["$scope", function($scope){
    $scope.message = "Enter a keyword.";

  }]
);
~~~

### Calling Controller Functions From The View

Let's add a search button to the page. When we click on this button we'll have the controller send us back some results.

~~~
<input type="submit" value="Search" ng-click="search()">
~~~

We use the `ng-click` attribute to call a function that exists on the current controller's scope. 

Now, let's define that `search` function in our controller. We do this by defining it as a method on the `$scope` object we pass in:

~~~
$scope.search = function(){
  $scope.results = ["One", "Two", "Three"];
}
~~~
By defining this function on the `$scope`, our view can now see it and call it.

For now, we'll define these results as a simple array of words. But eventually we'll have this function go and get records from Flickr.

With these in place, we can display these "results"  on our page.

Let's place each result inside of a `span` element, and we'll use a
paragraph tag around each result. Here's what we add to our view:

~~~html
<section>
  <p ng-repeat="result in results" ng-bind="result"></p>
</section>
~~~

Angular gives us an `ng-repeat` directive that works like a `foreach` loop in
other languages. We're basically saying "for each result in the results array",
which is on our scope, then repeat the code inside of this region, using `result`
as a variable that we can reference." In this case, the `<p>` tag will repeat
until there are no more results to display. This is a common pattern in frameworks like Ruby on Rails
and other JavaScript templating languages, so for
many developers, it's quite natural.

With this in place we can click on the button and see our results. But these aren't the results we're looking for. Let's shift gears now and change our code so it actually gets data from Flickr's API. 


## Fetching Data

Flickr provides easy access to data through its JSON api, and we can access it from our web page using the "padded JSON", or JSONP, format.  By sending a request to Flickr's API with a keyword, we can
search all photos on Flickr tagged with that keyword. For example, if we were
to search for photos tagged with "angular", we'd make a request like this:

<http://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=angular&jsoncallback=JSON_CALLBACK>

The `callback=` part of the URL is the name of the function that we write to
parse out the request for us. That's how JSONP works - we include a remote script that calls a function we define, and passes all the data as an argument to that function. We parse it all out on our side. It's a clever way to sidestep the same origin policy.  We're using the function name `JSONP_CALLBACK` because if we
do so, Angular will take care of all the parsing for us, so we'll have very
very little code to write!

When we make this request we'll get a response that looks like this:

~~~json
SON_CALLBACK({
  "title": "Recent Uploads tagged angular",
  "link": "http://www.flickr.com/photos/tags/angular/",
  "description": "",
  "modified": "2013-10-12T13:48:44Z",
  "generator": "http://www.flickr.com/",
  "items": [
     {
      "title": "Flsych",
      "link": "http://www.flickr.com/photos/srmansilla/10225715973/",
      "media": {"m":"http://farm4.staticflickr.com/3710/10225715973_39f9b19cb8_m.jpg"},
      "date_taken": "2013-07-28T19:42:38-08:00",
      "description": "Some description",
      "published": "2013-10-12T13:48:44Z",
      "author": "nobody@flickr.com (Sr. Mansilla)",
      "author_id": "37914705@N06",
      "tags": "panoramic angular amazing"
     },
     {
      "title": "_MG_0040.jpg",
      "link": "http://www.flickr.com/photos/jordibenitez/10177041986/",
      "media": {"m":"http://farm9.staticflickr.com/8556/10177041986_2b16bbcee4_m.jpg"},
      "date_taken": "2013-10-05T11:05:55-08:00",
      "description": "Another description",
      "published": "2013-10-09T21:33:02Z",
      "author": "nobody@flickr.com (jordi benitez -Mikan-)",
      "author_id": "51112500@N03",
      "tags": "ibiza competicion angular"
     }
  ]
})
~~~

The actual image is located under the `media -> m` node. The title and
description are easy to locate though.

### Using $http

Angular includes a service called `$http()` that can easily make simple HTTP 
requests. So in our controller, let's change our `search()` function from 
a static array of results to one that fetches results from Flickr.

~~~javascript
$scope.search = function(){
  var query = encodeURIComponent($scope.keyword);
  var flickrURL = 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&tags='                  + query + '&jsoncallback=JSON_CALLBACK'; 

  $http.jsonp(flickrURL).then(function(data){
    // this is the success part
  }, function(){
    // this is the errors part
  });
}
~~~
First, we create a variable to hold the search
query. The value of the query is the HTML escaped
version of the keyword typed into the text box, which
we bound to the scope.

Then we use the `$http.jsonp()` method to make the request. This method returns
a Promise object which has a `then()` method that takes a 
`success` calback and an `error` callback similar to how jQuery works. 
So once again, this is a familiar approach.

When the response is successful, we can parse out the results and add them to the
`$scope`, so inside of the `success` callback, we'll add this code:

~~~
var data = response.data;
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
~~~

And when there's an error, let's just set the `message` variable on the scope 
to say that there was an error. We'll also set the results to an empty array.
add this:

~~~
$scope.results = [];
$scope.message = "There was an error.";
~~~

This code does a lot of stuff at once, and is
very inelegant, but this is our first pass at this code. We'll come back around later and fix it up.

Now let's modify the view so it calls the correct properties of our `result` object. Alter the looping
section of the view so it looks like this:

~~~
<section>
  <figure ng-repeat="result in results">
    <figcaption ng-bind="result.title"></figcaption>
    <img ng-src="{{result.image}}">
  </figure>
</section>
~~~

Instead of a single paragraph, we're putting in a `figure` element
that contains a `figcaption` and an image. The only tricky part here
is the `ng-src` attribute. In order for the image to load properly
on-demand, we must use this `ng-src` attribute instead of the regular
`src` attribute, and the value of this attribute needs to be an 
Angular expression. An Angular expression is somewhat like 
`ng-bind`.

When we do this change to our view, we can now get new results from Flickr
by searching for images by their tag.

However, our controller does far, far too much work. An Angular controller
is supposed to handle changes to the view. We've got it doing business
logic like searching and transforming results. That's the domain of Angular
services. So let's fix that.


## Refactoring to Services

Instead of doing the work of fetching and parsing the info from Flickr in
the controller, we can do it in an Angular service.


Let's declare a `PhotoSearch` service that will be responsible for fetching
photo results from Flickr.

~~~
FlickrSearch.service("PhotoSearch", ["$http",  function($http){

}]);
~~~

Inside this service we'll create a function that will get photos with the
given keyword.

~~~
  this.findAllByKeyword = function(query){
    query = encodeURIComponent(query);
    var flickrURL = 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=' + query + '&jsoncallback=JSON_CALLBACK'; 
    return ($http.jsonp(flickrURL); 
  };
~~~




Then we'll change the Controller. We have to pass in the `PhotoSearch` service 
to the controller, which means we have to modify the Controller's declaration so it looks like this:

~~~
FlickrSearch.controller(
  "MainCtrl", ["$scope", "PhotoSearch",  function($scope, PhotoSearch){
~~~

We've added the `PhotoSearch` to both the array of names and the function
parameters.

Then, instead of calling the `$http.jsonp` method, we simply call our service.

~~~
PhotoSearch.findAllByKeyword($scope.keyword).then(function(response){
~~~

At this point the controller looks like this:


~~~
FlickrSearch.controller(
  "MainCtrl", ["$scope", "PhotoSearch",  function($scope, PhotoSearch){
    $scope.message = "Enter a keyword.";
    
    $scope.search = function(){
      PhotoSearch.findAllByKeyword($scope.keyword).then(function(response){
        var data = response.data;
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

      }).error(function(){
        $scope.results = [];
        $scope.message = "There was an error.";
      });
    }
  }]
);
~~~


But we can do better. The controller is still doing more work than it should. 
Let's encapsulate the parsing of the data into its own service. We'll create
a `FeedParser` service with a `parse` function that does the
parsing on the data. When we define this, we're going to
assume that we're not passing in the whole request, just the
data on the request. So the parsing service ends up looking like this:

~~~
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
~~~

Now, we could certainly inject this `FeedParser` service into the controller
and use it there, but it turns out that the `$http` service supports
transforming the response data it recieves, and we can
easily hook into that! So  we're going
to inject this `FeedParser` service into the `PhotoSearch` service.

~~~
FlickrSearch.service("PhotoSearch", ["$http", "FeedParser",  function($http, FeedParser){
~~~

Then, when we call the `$http.jsonp()` function, we pass a second
argument, which is a JavaScript object that lets us configure some options
for the request and response. One of those options is the response transformation.

~~~
return ($http.jsonp(flickrURL, {
  transformResponse: function(data){
    return FeedParser.parse(data);
  }
}));
~~~

The `transformResponse` callback fires when the response comes back, and it
passes just the data that needs transforming. We can pass
that data right to our `FeedParser` serivce's `parse()` method!

Finally, we change our Controller so it simply assigns the resulting response
data from the `PhotoSearch` serivce right to the `$scope`:

~~~javascript
$scope.search = function(){
  PhotoSearch.findAllByKeyword($scope.keyword).then(function(response){
    $scope.results = response.data;
  }, function(){
    $scope.results = [];
    $scope.message = "There was an error.";
  });
}
~~~

And our code is much, much cleaner, thanks to the framework Angular
provides for us.

Services provide a nice simple way to encapsulate things, but Angular also provides
Factories and Providers, which give you more flexibility to create complex
business objects and controll visibility of methods. But now, let's look at
creating our own custom directives, which will let us create reusable components.

## Building Directives

Angular provides tons of built-in directives, like `ng-bind`, `ng-model`, and 
`ng-repeat`, but we can build our own using the Angular `directive()` method.

To define a directive, we decide if we want the directive to be an attribute
on an existing tag, a completely new tag, or even an HTML comment.  Each
of these have advantages and disadvantages that you'll need to explore, but
in this project we're going to create a directive that defines a new element 
called `<photo>`. Let's define the new markup *first* this time. Doing the markup of a directive first can help us decide if we like how the interface works. Then we just have
to write the code to make it work that way.

~~~
<section>
  <photo ng-repeat="result in results"
         result="{{result}}"></photo>
</section>
~~~

We're defining this element so it has an attribute called `result` that 
takes in the result that we get from the iterator above.

It can still support the `ng-repeat` directive too, and we don't have to write any special code to make that work!


To define this directive, we add this code:

~~~
FlickrSearch.directive("photo", function(){
  return{
  
  };
});
~~~

The directive has to return a configuration object
that defines the directive. Since this is a directive
that defines an element, we'll use the `restrict` option
to restrict it to elements only.


~~~
FlickrSearch.directive("photo", function(){
  return{
    restrict: "E"  
  };
});
~~~

Next, we need to define the HTML that gets placed
on the screen when the directive is used. We do this with
the `template` property, and we just use a string of 
HTML tags, using Angular expressions to put values into
the HTML. This is very similar to what you'd do with other
templating languages.

~~~
FlickrSearch.directive("photo", function(){
  return {
    restrict: 'E',
    template: '<figure><figcaption>{{result.title}}</figcaption><img src="{{result.image}}"</figure>'
  }
});
~~~

It's important to remember to put in the commas between the name and value pairs in 
this object definition!

Now, if we leave it like this, the `<photo>` element stays on the page. But
we can tell Angular to replace the directive markup with our template instead.

~~~
FlickrSearch.directive("photo", function(){
  return {
    restrict: 'E',
    template: '<figure><figcaption>{{result.title}}</figcaption><img src="{{result.image}}"</figure>',
    replace: true
  }
});
~~~

Finally, we can make the `result` attirbute an absolute requirement,
  so that we'll get an error if we forget to use it when we place this
  on our page. We do that with the `required` property.

~~~
FlickrSearch.directive("photo", function(){
  return {
    restrict: 'E',
    required: "^result",
    template: '<div><p>{{result.title}}</p><img src="{{result.image}}"</div>'
  }
});
~~~

With this in place, our view now understands our new `<photo>` element
and we have a slightly cleaner view. However, doing this has some
drawbacks. First, while it's cool to be able to create a helper like this,
it also obscures the markup that's used to build this region. Now
instead of looking at the view you have to go find the definition
for the directive. Second, creating HTML in strings is a pretty 
ugly way to do things. But we can put the HTML in its own file and 
use the `templateURI` option. Of course, that means that the template has to be fetched as a separate Ajax request to the server.


## Testing

We've built a fairly simple application, but we've not
gone about it in the most appropriate way for production.
We need to test our production code, and so we should
set up a test suite for our application.

We'll use PhantomJS, Karma, the Jasmine testing framework to 
do a test suite for our application. These are the same tools
that the AngularJS team uses to write Angular. To do this, we 
need to have NodeJS installed on our machine as well.

To set this up, we need to create a `package.json` file that lists
all of these dependencies. This file is a "manifest" for our web
application.

~~~
{
  "name": "FlickrSearch",
  "description": "A simple Angular app to search FLickr",
  "devDependencies": {
    "phantomjs" : "*",
    "karma" : "*",
    "karma-junit-reporter" : "*",
    "karma-jasmine" : "*",
    "karma-ng-scenario" : "*"
  }
}
~~~

This declares the development dependencies of our project and includes
the plugins for Karma that support Jasmine and Angular. It also adds
in support for a JUnit-compatible reporter so the test suite can 
work seamlessly with your continous integration system.

Next, we need to create a new folder to hold our tests. Create a `test` folder in the root of the project:

~~~
$ mkdir test/
~~~

In that test folder, create a new folder called `lib` and another called `units`:

~~~
$ mkdir test/lib
$ mkdir test/units
~~~

We need to fetch the `angular-mocks` library and place it in this folder.  We get that from <http://code.angularjs.org/1.0.8/angular-mocks.js>, and 
we can grab it quickly with `curl` again:

~~~
$ curl http://code.angularjs.org/1.0.8/angular-mocks.js > test/lib/angular-mocks.js
~~~

Now we can set up Karma by issuing the command

`karma init test/karma.config.js`

and it will start an interactive generator which we can use to build the configuration file for the Karma test runner.

1. First, it asks us for a testing library. We'll leave this as `jasmine`.
2. Next, it will ask if we want to use `require.js`, which we do not want right now.
2. Next, it asks us for the web browser we want to use for testing, and we'll leave this as `chrome`. We'll enter a blank value when prompted again.
4. Next it asks us which files we'd like to test. This is a little misleading - this is where we specify where our application *and our testing files* files are. We need to specify `javascripts/app.js` as well as our AngularJS libraries and our test folders. So, here's what you should use, in this order:
    
    * `lib/angular.min.js`
    * `javascripts/*.js`
    * `test/lib/angular-mocks.js`
    * `test/**/*_spec.js`   (This last one will give you a warming as we've not created any of these files yet.)

5. Then it asks us if there are any files we'd like to exclude. We'll go with the default.

6. It then asks if we'd like Karma to watch for file changes, which we definitely want.

Now we can test our our configuration:

~~~
$ karma start test/karma.config.js
~~~

This will give us a result that looks like this:

~~~
INFO [karma]: Karma server started at http://localhost:9876/
INFO [launcher]: Starting browser Chrome
WARN [watcher]: Pattern "/Users/brianhogan/js/tccc15/06_testing/test/**/*_spec.js" does not match any file.
INFO [Chrome 30.0 (Mac)]: Connected on socket id GJKLqY69xaZ4GEwoSpTB
Chrome 30.0 (Mac): Executed 0 of 0 SUCCESS (0.108 secs / 0 secs)
/*
~~~

So now we need an actual test to write. Let's test the controller's `search` function and ensure that it does load some records into the page.

In the `test/units` folder, create a new file called `MainController_spec.js`. 
We'll use this file to write a test for our controller.

Start out with a basic test:

~~~
describe('MainCtrl', function(){
});
~~~

~~~

  var deferred, q, photosearch, scope; 

  //mock FlickrSearch so we can inject our own dependencies
  beforeEach(module('FlickrSearch'));

  //mock the controller for the same reason and 
  // and include $rootScope and $controller
  beforeEach(inject(function($rootScope, $controller, $q){

    //create an empty scope
    scope = $rootScope.$new();

  }));

~~~

Inside of that method, we need to mock the controller,
and if you remmeber, our controller needs a PhotoService 
dependency.

A unit test is supposed to be isolated from any external dependencies. We should not be hitting Flickr's serivce in
our unit tests. So we will need to create a fake version
of our service.

Remember that our service returns a Promise. In order for our mock to 
stand in for the real service, our mock has to
also return a promise. So we do that by creating our own
promise and making it resolve with some fake data.

~~~
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
~~~

We define a `result` object with a `data` property,
which is an array of fake picture results. This way
when our controller goes to call
the `.data` property on the response, it will think
it worked as expected.

Then we can define the controller by injecting
the scope and the fake PhotoService in.

~~~

    //declare the controller and inject the scope and our Mock
    $controller('MainCtrl', {$scope: scope, PhotoSearch: photosearch});


~~~

Finally, we can write the actual test to
ensure that when we search, we get results
put on the scope.


~~~
  it("should fetch two photos", function(){

    // method call on the scope
    scope.search("test");

    // promises are not resolved until
    // // the scope is applied.
    scope.$apply();

    // The actual test
    expect(scope.results.length).toBe(2);
  }); 
~~~

Now what we've done here is mocked out the dependencies
for the controller. But we still need to write tests
that prove that the integration with Flickr actually
returns results. For that, we use "end to end" tests,
which are essentially integration tests. Those,
however, are beyond the scope of this project.


## End-to-end Testing

We can use Karma to run complete integration, or 
end to end tests. These kinds of tests simulate how
the end user will work with the app. We don't do
much mocking in these kinds of tests. Instead, we
interact with the browser like the user might.

Let's create a new folder for these tests called `test/e2e`

~~~
$ mkdir test/e2e
~~~

Now, let's create a simple end-to-end test that searches Flickr for photos 
with the keyword "Red". It'll fill in the field, press the button,
     and then scan the resulting HTML for the word "red"

In the file `test/e2e/e2e_spec.js`, add this code:

~~~
describe("Integration/E2E Testing", function() {

  // start at root before every test is run
  beforeEach(function() {
    browser().navigateTo('/');
  });

  it("can load photos when searched", function(){
    input("keyword").enter("red");
    element("input[type=submit]").click();
    expect(element('#results').html()).toContain('Red');
  });

});
~~~

In order to run these end-to-end tests, our app needs to be run using a web
server. Karma will connect to that web server to test the application.  
You could whip up a simple web server with Node.JS, you could use 
Apache or IIS, or you could use a simple web server like the 
built-in server that ships with the Python language:

~~~
$ python -m SimpleHTTPServer
~~~

This starts up a web server in the current folder, serving the files at
http://localhost:8000.


With the files served, we need to make a new configuration file for Karma. Most of the
file will be the same, so let's just copy the original `karma.config.js` file:

~~~
$ cp test/karma.config.js test/karma.e2e.config.js
~~~


Now we open the `test/karma.e2e.config.js` file and locate this section:

~~~
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'lib/angular.min.js',
  'javascripts/*.js',
  'test/lib/angular-mocks.js',
  'test/units/*_spec.js'
];
~~~

and change it so it uses the Angular scenarios libraries instead of Jasmine:

Thus, we change 

~~~
  JASMINE,
  JASMINE_ADAPTER,
~~~

to 

~~~
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
~~~

Then, we have to tell it to look at our `test/e2e` folder instead of the 
`test/units` folder, so we change this:

~~~
  'test/units/*_spec.js'
~~~

to 

~~~
  'test/e2e/*_spec.js'
~~~

The finished section should look like this:

~~~
files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'lib/angular.min.js',
  'javascripts/*.js',
  'test/lib/angular-mocks.js',
  'test/e2e/*_spec.js'
];
~~~

Then, add this at the bottom of the file:

~~~
urlRoot = '/__karma/';

proxies = {
  '/' : 'http://localhost:8000/'
};
~~~


~~~
$ karma start test/karma.e2e.config.js
~~~


        
## Wrapping Up
With this simple example, you've seen how the different components
of Angular work together to create something quite powerful.

From here, you'll want to look at going further. Investigate more 
complex directives that are bound to controllers and have
bi-directional data. Look at how Angular filters can transform or
limit data on the screen. Look at `angular-resource` as a way to work with REST
services like the ones you can create with Rails, Express, or Sinatra.

Finaly, look at using Yeoman or `angular-seed` to create your projects.

#### Copyright 2013 Brian P. Hogan

