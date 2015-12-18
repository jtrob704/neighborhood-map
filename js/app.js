var locationData = [
    {
        locationName: 'EpiCentre',
        latLng: {lat: 35.225372, lng: -80.841967}
    },
    {
        locationName: 'Discovery Place',
        latLng: {lat: 35.2295793, lng: -80.8411225}
    },
    {
        locationName: 'BB&T Ballpark',
        latLng: {lat: 35.2284356, lng: -80.8485039}
    },
    {
        locationName: 'Bank of America Stadium',
        latLng: {lat: 35.2256295, lng: -80.8527401}
    },
    {
        locationName: 'Time Warner Cable Arena',
        latLng: {lat: 35.2250475, lng: -80.8393389}
    }
];


var KoViewModel = function () {
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
        maxWidth: 600
    });
    // Build Markers via the Maps API and place them on the map.
    self.allPlaces.forEach(function (place) {
        var markerOptions = {
            map: self.googleMap,
            position: place.latLng,
            animation: google.maps.Animation.DROP
        };

        place.marker = new google.maps.Marker(markerOptions);


        google.maps.event.addListener(place.marker, 'click', function () {
            infowindow.open(self.googleMap, this);
            place.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                place.marker.setAnimation(null);
            }, 1000);
        });

        // You might also add listeners onto the marker, such as "click" listeners.
    });


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

            if (place.locationName.toLowerCase().indexOf(searchInput) !== -1) {
                self.visiblePlaces.push(place);
            }
        });


        self.visiblePlaces().forEach(function (place) {
            place.marker.setVisible(true);
        });
    };


    function Place(dataObj) {
        this.locationName = dataObj.locationName;
        this.latLng = dataObj.latLng;

        // You will save a reference to the Places' map marker after you build the
        // marker:
        this.marker = null;
    }

};

ko.applyBindings(new KoViewModel());
