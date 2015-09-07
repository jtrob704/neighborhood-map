/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

var locations = [{
        
            type: 'entertainment',            
            name: 'EpiCentre',
            url: 'http://epicentrenc.com/',
            lat: 35.225372,
            long: -80.841967            
            }
    ];




var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 35.2251901, lng: -80.8465473},
        zoom: 16
    });

    var contentString = "Dummy Content";

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: {lat: locations[0].lat, lng: locations[0].long}
    });
  marker.addListener('click', function() {
      infowindow.open(map, marker);
  });
}


var viewModel = function () {
    var listObservable = ko.observableArray();
}

ko.applyBindings(viewModel);