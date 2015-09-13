/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

//Add model data
var locations = [{        
        name: 'EpiCentre',        
        lat: 35.225372,
        long: -80.841967
    }, {
        name: 'Discovery Place',        
        lat: 35.2295793,
        long: -80.8411225
    }, {
        name: 'BB&T Ballpark',        
        lat: 35.2284356,
        long: -80.8485039
    }, {        
        name: 'Bank of America Stadium',        
        lat: 35.2256295,
        long: -80.8527401
    }, {        
        name: 'Time Warner Cable Arena',        
        lat: 35.2250475,
        long: -80.8393389
    }
];

var ViewModel = function () {   
    var self = this;
    
    var map;

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 35.2251901, lng: -80.8465473},
            zoom: 16
        });
    }
    initMap();

    var infowindow = new google.maps.InfoWindow({
        maxWidth: 160
    });

    var markers = [];

    for (var i = 0, len = locations.length; i < len; i++) {

        //var latLong = new google.maps.LatLng(locations[i].lat, locations[i].long);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i].lat, locations[i].long),
            map: map,
            animation: google.maps.Animation.DROP
        });

        markers.push(marker);

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i].name);
                infowindow.open(map, marker);
            };
        })(marker, i));
    }
    
    self.searchString = ko.observable('');
};

ko.applyBindings(ViewModel);