/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var model = {
    points: [
        {
            type: 'entertainment',
            iconUrl: 'icons/entertainement.svg',
            name: 'EpiCentre',
            url: 'http://epicentrenc.com/',
            lat: 35.225372,
            long: -80.841967,
            highlight: ko.observable(false)
        }
    ],
    currentPoint: ko.observable(null)
};

console.log(model.points[0].lat + "," + model.points[0].long);

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 35.2251901, lng: -80.8465473},
        zoom: 16
    });
    
var latLong = new google.maps.LatLng(model.points[0].lat + "," + model.points[0].long);

        var marker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: {lat: 35.225372, lng: -80.841967}
        });
marker.setMap(map);
}

var viewModel = function () {
    var listObservable = ko.observableArray();
}

ko.applyBindings(viewModel);