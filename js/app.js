/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Model = {
    points: [
        {
            type: 'entertainment',
            iconUrl: 'icons/entertainement.svg',
            name: 'Discovery Place',
            url: 'http://epicentrenc.com/',
            lat: 35.225372,
            long: -80.841967,
            highlight: ko.observable(false)
        }
    ],
    currentPoint: ko.observable(null)
};

var ViewModel = function () {

// Initialize Standard and Knockout Observable Variables

    var self = this;
    self.dialogItem = ko.observable();
    self.markerArray = ko.observableArray();
    self.filterArray = ko.observableArray();
    self.mapUnavailable = ko.observable(false);
    self.listArray = ko.observableArray();
    self.query = ko.observable("");
    self.dialogVisible = ko.observable(false);
    self.showMarkers = ko.observable(true);
    var map, place;
    //var weatherCity; 
    var activityButton = false;

// Initialize DOM using IIFE

    var initDom = function() {

// Verify Map Object in DOM and initialize map or display map error

        if (typeof window.google === 'object' && typeof window.google.maps === 'object') {

// Set initial map options

            var mapOptions = {
            // disableDefualtUI: true,
                zoom: 16,
                center: new google.maps.LatLng(35.2235249,-80.8406035),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

// Instantiate new map object with call to Google Maps API

            map = new google.maps.Map(document.getElementById('map'), mapOptions);
                infowindow = new google.maps.InfoWindow({
                content: null
            });

// Create an array containing points of interest using data Model for display on map

            var pointsArray = Model.points;
            var pointsArrayLength = pointsArray.length;

            for (var x=0; x < pointsArrayLength; x++) {
                var pointPosition = new google.maps.LatLng(
                pointsArray[x].lat,
                pointsArray[x].long
                );

                var marker = new google.maps.Marker({
                    position: pointPosition,
                    title: pointsArray[x].name,
                    url: pointsArray[x].url,
                    icon: pointsArray[x].iconUrl,
                    map: map,
                    type: pointsArray[x].type,
                    highlight: pointsArray[x].highlight,                    
                });            
// Add marker to marker array to show google markers and to display array entries in location list

                self.markerArray.push(marker);
                self.listArray.push(marker);
                
