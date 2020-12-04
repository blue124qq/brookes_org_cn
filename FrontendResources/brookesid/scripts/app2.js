var myApp = angular.module('myApp', []);
angular.module('myApp.controllers', []);




    /* get all activities service */
myApp.factory('getActivities', ['$http', function ($http) {

    var service = {};

    service.fetch = function (callback) {

		var url = 'https://moodle.brookes.ac.uk/webservice/rest/server.php?wstoken=a350ab449dfc1807a951e1e34d080683&wsfunction=local_brookes_edge_ws_get_all_activities&moodlewsrestformat=json'

        $http.get(url)
            .success(callback)
            .error(callback);
    }

    service.reset = function () {
        return [];
    }
    return service;

}])


/* main controller - activities */
    .controller('allActivitiesCtrl',
['$rootScope', '$scope', '$http', 'getActivities',
    function ($rootScope, $scope, $http, getActivities) {

        $scope.loadMyData = function () {
            $scope.activities = [];

            var allActivities = getActivities.fetch(function (activities) {
                $scope.activities = activities;
                $scope.loadingFinished = true;
            });

        };

        //initial load
        $scope.loadMyData();

        $scope.query = {}
        $scope.queryBy = '$'
        $scope.orderProp = "activity_shortname";

    }])


 .filter('htmlToPlainText', function () {
     return function (text) {
         return text ? String(text).replace(/(&nbsp;)/ig, ' ').replace(/(<([^>]+)>)/ig, '') : '';
     };
 });