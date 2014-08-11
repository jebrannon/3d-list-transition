'use strict';

var angular = require('angular');
var PageController = require('./controllers/PageController');
var StoryGlueDirective = require('./directives/StoryGlueDirective');
var StoryItemDirective = require('./directives/StoryItemDirective');
var StoryAutoDirective = require('./directives/StoryAutoDirective');
var StoryInteractionDirective = require('./directives/StoryInteractionDirective');

var app = angular.module('ngApp', []);

app.directive('ngStoryGlue', ['$window', '$interval', '$timeout', StoryGlueDirective]);
app.directive('ngStoryItem', ['$window', StoryItemDirective]);
app.directive('ngStoryInteraction', ['$window', '$timeout', StoryInteractionDirective]);
app.directive('ngStoryAuto', ['$window', '$timeout', StoryAutoDirective]);

app.controller('PageController', ['$scope', '$window', '$timeout', PageController]);