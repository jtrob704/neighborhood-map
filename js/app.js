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
    },{
        type: 'education',
        name: 'Discovery Place',
        url: 'http://www.discoveryplace.org/',
        lat: 35.2295793,
        long: -80.8411225
    }
        
];

var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 35.2251901, lng: -80.8465473},
        zoom: 16
    });

for(var i = 0, len = locations.length; i < len; i++) {
    

//Create each location as an item
    var items = function (data) {
        var self = this;
        self.type = ko.observable(data.type);
        self.name = ko.observable(data.name);
        self.url = ko.observable(data.url);
        self.latLong = ko.observable(new google.maps.LatLng(data.lat, data.long));

console.log(self.latLong);
//Create markers for each location
            var marker = new google.maps.Marker({
            //map: null,
            animation: google.maps.Animation.DROP,
            position: self.latLong(),
            title: self.name()
        });

    };
       /* marker.addListener('click', function () {
            infowindow.open(map, marker);
        }); */
    }

    var ViewModel = function () {
            var self = this;
            //self.searchString = ko.observable('');
}

ko.applyBindings(ViewModel);