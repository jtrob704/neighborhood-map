/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

//Add model data
var locations = [{
        type: 'entertainment',
        name: 'EpiCentre',
        url: 'http://epicentrenc.com/',
        lat: 35.225372,
        long: -80.841967
    }, {
        type: 'education',
        name: 'Discovery Place',
        url: 'http://www.discoveryplace.org/',
        lat: 35.2295793,
        long: -80.8411225
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

    for (var i = 0, len = locations.length; i < len; i++) {

        var latLong = new google.maps.LatLng(locations[i].lat, locations[i].long);

        var marker = new google.maps.Marker({
            position: latLong,
            map: map
        });
    }
};

ko.applyBindings(ViewModel);