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

function googleError() {
    "use strict";
    document.getElementById('map-container').innerHTML = "<h2>Google Maps is not loading. Please try refreshing the page later.</h2>";
}

var Place = function (data) {
    "use strict";
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
    "use strict";
    var self = this;
    // Build the Google Map object. Store a reference to it.
    self.googleMap = new google.maps.Map(document.getElementById('map-container'), {
        center: {lat: 35.2251901, lng: -80.8465473},
        zoom: 16
    });
    // Build "Place" objects out of raw place data. It is common to receive place
    // data from an API like FourSquare. Place objects are defined by a custom
    // constructor function you write, which takes what you need from the original
    // data and also lets you add on anything else you need for your app, not
    // limited by the original data.
    self.allPlaces = [];
    locationData.forEach(function (place) {
        self.allPlaces.push(new Place(place));
    });
    var infowindow = new google.maps.InfoWindow({
        content: "",
        maxWidth: 300
    });
    // Build Markers via the Maps API and place them on the map.
    self.allPlaces.forEach(function (place) {
        var markerOptions = {
            map: self.googleMap,
            position: new google.maps.LatLng(place.lat(), place.lng()),
            animation: google.maps.Animation.DROP
        };
        place.marker = new google.maps.Marker(markerOptions);
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/' + place.id() +
                    '?client_id=2EPTHEHMQCM0PMFHXGWP5QSVM5W1LMPT3L5UL1V3PAAE1E0T&client_secret=YGSM3XHOJLJICSCP4CG3KUHQKCH4ZDWD0UIBDBC54SQQQGA0&v=20130815',
            dataType: "json",
            success: function (data) {
                // Make results easier to handle
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
                var content = '<div id="iWindow"><h4>' + place.locationName() + '</h4><div id="pic"><img src="' +
                        place.photoPrefix() + '110x110' + place.photoSuffix() +
                        '" alt="Image Location"></div><p>Information from Foursquare:</p><p>' +
                        place.phone() + '</p><p>' + place.address() + '</p><p>' +
                        place.description() + '</p><p>Rating: ' + place.rating() +
                        '</p><p><a href=' + place.url() + '>' + place.url() +
                        '</a></p><p><a target="_blank" href=' + place.canonicalUrl() +
                        '>Foursquare Page</a></p><p><a target="_blank" href=https://www.google.com/maps/dir/Current+Location/' +
                        place.lat() + ',' + place.lng() + '>Directions</a></p></div>';
                google.maps.event.addListener(place.marker, 'click', function () {
                    infowindow.open(self.googleMap, this);
                    place.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function () {
                        place.marker.setAnimation(null);
                    }, 1000);
                    infowindow.setContent(content);
                });
            },
            error: function (e) {
                infowindow.setContent('<h5>Foursquare data is unavailable. Please try refreshing later.</h5>');
                document.getElementById("error").innerHTML = "<h4>Foursquare data is unavailable. Please try refreshing later.</h4>";
            }
        });
    });
    self.showInfo = function (place) {
        google.maps.event.trigger(place.marker, 'click');
        self.hideElements();
    };

    // Toggle the nav class based style
    // Credit Stacy https://discussions.udacity.com/t/any-way-to-reduce-infowindow-content-on-mobile/40352/25
    self.toggleNav = ko.observable(false);
    this.navStatus = ko.pureComputed(function () {
        return self.toggleNav() === false ? 'nav' : 'navClosed';
    }, this);

    self.hideElements = function (toggleNav) {
        self.toggleNav(true);
        // Allow default action
        // Credit Stacy https://discussions.udacity.com/t/click-binding-blocking-marker-clicks/35398/2
        return true;
    };

    self.showElements = function (toggleNav) {
        self.toggleNav(false);
        return true;
    };

    // This array will contain what its name implies: only the markers that should
    // be visible based on user input. My solution does not need to use an 
    // observableArray for this purpose, but other solutions may require that.
    self.visiblePlaces = ko.observableArray();
    // All places should be visible at first. We only want to remove them if the
    // user enters some input which would filter some of them out.
    self.allPlaces.forEach(function (place) {
        self.visiblePlaces.push(place);
    });
    // This, along with the data-bind on the <input> element, lets KO keep 
    // constant awareness of what the user has entered. It stores the user's 
    // input at all times.
    self.userInput = ko.observable('');
    // The filter will look at the names of the places the Markers are standing
    // for, and look at the user input in the search box. If the user input string
    // can be found in the place name, then the place is allowed to remain 
    // visible. All other markers are removed.
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
ko.applyBindings(new KoViewModel());    