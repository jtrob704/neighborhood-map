// JSON data for locations
var locationData = [
    {
        locationName: 'EpiCentre',
        lat: 35.225372,
        lng: -80.841967,
        id: '4d9a5bf18163a35d26ec597e'
    },
    {
        locationName: 'Discovery Place',
        lat: 35.2295793,
        lng: -80.8411225,
        id: '4b058642f964a5209a5a22e3'
    },
    {
        locationName: 'BB&T Ballpark',
        lat: 35.2284356,
        lng: -80.8485039,
        id: '4fc4ec9ee4b0ae08adad383c'
    },
    {
        locationName: 'Bank of America Stadium',
        lat: 35.2256295,
        lng: -80.8527401,
        id: '4b155049f964a52046b023e3'
    },
    {
        locationName: 'Time Warner Cable Arena',
        lat: 35.2250475,
        lng: -80.8393389,
        id: '4b155049f964a52045b023e3'
    }
];

//Initialize map
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 35.2251901, lng: -80.8465473},
        zoom: 14,
        disableDefaultUI: true
    });

    ko.applyBindings(new KoViewModel());
}

// Called if app is unable to load Maps API
function googleError() {
    bootbox.alert("Unable to load Google Maps. Please try again later", function () {
    });
}

/* Setup a constructor to store API data and make it available outside AJAX call.
 * Based on code from Udacity forum https://discussions.udacity.com/t/having-trouble-accessing-data-outside-an-ajax-request/39072
 */
var Place = function (data) {

    this.locationName = ko.observable(data.locationName);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.id = ko.observable(data.id);
    this.marker = ko.observable();
    this.phone = ko.observable('');
    this.description = ko.observable('');
    this.address = ko.observable('');
    this.rating = ko.observable('');
    this.url = ko.observable('');
    this.canonicalUrl = ko.observable('');
    this.photoPrefix = ko.observable('');
    this.photoSuffix = ko.observable('');
    this.contentString = ko.observable('');
};

var KoViewModel = function () {

    var self = this;
// Load data for each location into Place constructor
    self.allPlaces = [];
    locationData.forEach(function (place) {
        self.allPlaces.push(new Place(place));
    });

// Initialize infowindow
    var infowindow = new google.maps.InfoWindow({
        content: "",
        maxWidth: 200
    });

    var bounds = new google.maps.LatLngBounds();
    // Build Markers via the Maps API and place them on the map.
    self.allPlaces.forEach(function (place) {
        var myLatLng = new google.maps.LatLng(place.lat(), place.lng());
        var markerOptions = {
            map: map,
            position: myLatLng,
            animation: google.maps.Animation.DROP
        };
        place.marker = new google.maps.Marker(markerOptions);
        bounds.extend(myLatLng);

        /* Make ajax call to Foursqaure API
         * 
         * Based on Foursquare code from Udacity forum https://discussions.udacity.com/t/foursquare-results-undefined-until-the-second-click-on-infowindow/39673
         */
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/' + place.id() +
                    '?client_id=2EPTHEHMQCM0PMFHXGWP5QSVM5W1LMPT3L5UL1V3PAAE1E0T&client_secret=YGSM3XHOJLJICSCP4CG3KUHQKCH4ZDWD0UIBDBC54SQQQGA0&v=20130815',
            dataType: "json",
            success: function (data) {
                // Format raw Foursquare API data into a more readable and consistent format
                var result = data.response.venue;
                var contact = result.hasOwnProperty('contact') ? result.contact : '';
                if (contact.hasOwnProperty('formattedPhone')) {
                    place.phone(contact.formattedPhone || '');
                }

                var location = result.hasOwnProperty('location') ? result.location : '';
                if (location.hasOwnProperty('address')) {
                    place.address(location.address || '');
                }

                var bestPhoto = result.hasOwnProperty('bestPhoto') ? result.bestPhoto : '';
                if (bestPhoto.hasOwnProperty('prefix')) {
                    place.photoPrefix(bestPhoto.prefix || '');
                }

                if (bestPhoto.hasOwnProperty('suffix')) {
                    place.photoSuffix(bestPhoto.suffix || '');
                }

                var description = result.hasOwnProperty('description') ? result.description : '';
                place.description(description || '');
                var rating = result.hasOwnProperty('rating') ? result.rating : '';
                place.rating(rating || 'none');
                var url = result.hasOwnProperty('url') ? result.url : '';
                place.url(url || '');
                place.canonicalUrl(result.canonicalUrl);
                // Format and set content for infowindow
                var content = '<div id="iWindow"><h4>' + place.locationName() + '</h4><div id="pic"><img src="' +
                        place.photoPrefix() + '110x110' + place.photoSuffix() +
                        '" alt="Image Location"></div><p>Information from Foursquare:</br>' +
                        place.phone() + '</br>' + place.address() + '</br>' +
                        place.description() + '</br>Rating: ' + place.rating() +
                        '</br><a href=' + place.url() + '>' + place.url() +
                        '</a></br><a target="_blank" href=' + place.canonicalUrl() +
                        '>Foursquare Page</a></br><a target="_blank" href=https://www.google.com/maps/dir/Current+Location/' +
                        place.lat() + ',' + place.lng() + '>Directions</a></br></div>';
                // Click listener for Map markers
                google.maps.event.addListener(place.marker, 'click', function () {
                    map.setCenter(myLatLng);
                    infowindow.close();
                    map.panBy(-100, -400);
                    infowindow.open(map, this);
                    place.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function () {
                        place.marker.setAnimation(null);
                    }, 2100);
                    infowindow.setContent(content);
                });
                //Click listener to center map on infowindow close
                google.maps.event.addListener(infowindow, 'closeclick', function () {
                    map.setCenter(myLatLng);
                    map.fitBounds(bounds);
                });

                //Center map and fitbounds on resize
                window.onresize = function () {
                    map.setCenter(myLatLng);
                    map.fitBounds(bounds);
                };
            },
            // Print error message in the event ajax API call to Foursquare fails
            error: function (e) {
                bootbox.alert("Unable to retrieve data from Foursquare. Please try again later", function () {
                });
            }
        });
    });

    // Click listener for list items. Credit: http://codepen.io/prather-mcs/pen/KpjbNN
    self.showInfo = function (place) {
        google.maps.event.trigger(place.marker, 'click');
        self.hideElements();
    };

    self.toggleNav = ko.observable(false);
    this.navStatus = ko.pureComputed(function () {
        return self.toggleNav() === false ? 'nav' : 'navClosed';
    }, this);

    self.hideElements = function (toggleNav) {
        self.toggleNav(true);
        return true;
    };

    self.showElements = function (toggleNav) {
        self.toggleNav(false);
        return true;
    };

    // This array will contains only the markers that should be visible based on user input
    self.visiblePlaces = ko.observableArray();

    // Make all locations visible at first
    self.allPlaces.forEach(function (place) {
        self.visiblePlaces.push(place);
    });

    // Store user input
    self.userInput = ko.observable('');

    /* Filter marker based on user input
     * 
     * Based on code Map Marker filtering code from: https://codepen.io/prather-mcs/pen/KpjbNN?editors=001
     */
    self.filterMarkers = function () {
        var searchInput = self.userInput().toLowerCase();
        self.visiblePlaces.removeAll();
        // This looks at the name of each places and then determines if the user
        // input can be found within the place name.
        self.allPlaces.forEach(function (place) {
            place.marker.setVisible(false);
            if (place.locationName().toLowerCase().indexOf(searchInput) !== -1) {
                self.visiblePlaces.push(place);
            }
        });
        self.visiblePlaces().forEach(function (place) {
            place.marker.setVisible(true);
        });
    };
};