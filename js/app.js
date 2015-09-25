/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//"use strict";

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


    self.searchString = ko.observable('');
    var map;
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 35.2251901, lng: -80.8465473},
            zoom: 16
        });
    }
    initMap();
    var infowindow = new google.maps.InfoWindow({
        content: "",
        maxWidth: 600
    });
    var markers = ko.observableArray();
    for (var i = 0, len = locations.length; i < len; i++) {

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i].lat, locations[i].long),
            map: map,
            animation: google.maps.Animation.DROP
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.open(map, marker);
                OAuth.initialize('B9ST_ARNokhVTwx8qOyw-6UXWI8');
                OAuth.popup('instagram', {cache: true}).then(function (oauthResult) {
                    var instagramAPI = 'https://api.instagram.com/v1/media/search?lat=' + locations[i].lat + "&lng=" + locations[i].long;
                    return oauthResult.get(instagramAPI);
                }).then(function (data) {
                        var content = '<h4>' + locations[i].name + '</h4>' +
                                '<h5>' + locations[i].lat + ', ' + locations[i].long + '</h5>' +
                                '<img src="' + data.data[i].images.low_resolution.url + '">';
                        infowindow.setContent(content);                  
                }).fail(function (err) {
                    alert('Unable to retrieve data from Instagram');
                });


            };
        })(marker, i));
        google.maps.event.addListener(marker, 'click', (function (marker) {
            return function () {
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    stopAnimation(marker);
                }
                function stopAnimation(marker) {
                    setTimeout(function () {
                        marker.setAnimation(null);
                    }, 2000);
                }
            };
        })(marker));
    }
};
ko.applyBindings(ViewModel);