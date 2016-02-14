var loadJSON = function(path, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 400){
            var res = JSON.parse(xhr.responseText);
            callback(res);
        } else {
            console.log("Response from server: " + xhr.status);
        }
    };
    xhr.send();
};

var center = {
    "latitude": 27.9928566,
    "longitude": -82.4962665
  };
var centerArr = [center.latitude,center.longitude]; 
  
var geojson = [
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4000349,
        28.0553173
    ]
    },
    "properties": {
    "title": "Felicitous",
    "description": "Address: 11706 N 51st St<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "felicitous-tampa"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4060211181641,
        28.032190322876
    ]
    },
    "properties": {
    "title": "Sacred Grounds",
    "description": "Address: 4819 E Busch Blvd<br>Rating: &#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "sacred-grounds-tampa"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4300842285156,
        28.0553493499756
    ]
    },
    "properties": {
    "title": "Mojo Books Records Coffee & Tea",
    "description": "Address: 2540 E Fowler Ave<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "mojo-books-records-coffee-and-tea-tampa"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.443811,
        28.069055
    ]
    },
    "properties": {
    "title": "Kaleisia Tea Lounge",
    "description": "Address: 1441 E Fletcher Ave<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "kaleisia-tea-lounge-tampa"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.459154,
        28.000023
    ]
    },
    "properties": {
    "title": "Jet City Espresso",
    "description": "Address: 5803 N Florida Ave<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "jet-city-espresso-tampa-2"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4003067016602,
        28.0548534393311
    ]
    },
    "properties": {
    "title": "Starbucks",
    "description": "Address: 5006 E Fowler Ave<br>Rating: &#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "starbucks-tampa-27"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.3935113847256,
        28.0463790893555
    ]
    },
    "properties": {
    "title": "Al-Aqsa Coffee House",
    "description": "Address: 10819 N 56th St<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "al-aqsa-coffee-house-tampa"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4035441875458,
        28.087797933724
    ]
    },
    "properties": {
    "title": "You Do The Dishes",
    "description": "Address: 15357 Amberly Dr<br>Rating: &#9733;&#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "you-do-the-dishes-tampa"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4378128,
        28.0688801
    ]
    },
    "properties": {
    "title": "Loving Hut",
    "description": "Address: 1905 E Fletcher Ave<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "loving-hut-tampa"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4596634,
        27.9919891
    ]
    },
    "properties": {
    "title": "The Independent",
    "description": "Address: 5016 N Florida Ave<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "the-independent-tampa"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4124979598144,
        28.0596543204794
    ]
    },
    "properties": {
    "title": "Starbucks",
    "description": "Address: University of South Florida Library<br>Rating: &#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "starbucks-tampa-13"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4597015380859,
        28.0068454742432
    ]
    },
    "properties": {
    "title": "The Blind Tiger Cafe",
    "description": "Address: 6500 N Florida Ave<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "the-blind-tiger-cafe-tampa-7"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4123751,
        28.0834726
    ]
    },
    "properties": {
    "title": "Twist Vapor Cafe",
    "description": "Address: 14937 Bruce B Downs Blvd<br>Rating: &#9733;&#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "twist-vapor-cafe-tampa"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4549407958984,
        27.9965362548828
    ]
    },
    "properties": {
    "title": "Starbucks",
    "description": "Address: 502 E Hillsborough Ave<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "starbucks-tampa-21"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.428614795208,
        28.057012706995
    ]
    },
    "properties": {
    "title": "The Boba House",
    "description": "Address: 2764 University Sq Dr<br>Rating: &#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "the-boba-house-tampa-2"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4378051757812,
        27.9600448608398
    ]
    },
    "properties": {
    "title": "The Blind Tiger Cafe - Ybor City",
    "description": "Address: 1901 E 7th Ave<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "the-blind-tiger-cafe-ybor-city-tampa-5"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4378099829458,
        27.9613126032645
    ]
    },
    "properties": {
    "title": "The Bunker",
    "description": "Address: 1907 N 19th St<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "the-bunker-tampa-3"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4362139,
        27.9603949
    ]
    },
    "properties": {
    "title": "Naviera Coffee Mills",
    "description": "Address: 2012 E 7th Ave<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "naviera-coffee-mills-tampa"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4555892944336,
        28.0032176971436
    ]
    },
    "properties": {
    "title": "Mikey's Cafe & Bakery Co.",
    "description": "Address: 6114 N Central Ave<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "mikeys-cafe-and-bakery-co-tampa"
},
{
    "type": "Feature",
    "geometry": {
    "type": "Point",
    "coordinates": [
        -82.4817123413086,
        28.0250263214111
    ]
    },
    "properties": {
    "title": "Got Tea",
    "description": "Address: 2202 W Waters Ave<br>Rating: &#9733;&#9733;&#9733;&#9733;",
    "marker-color": "#fc4353",
    "marker-size": "small"
    },
    "id": "got-tea-tampa"
}
];

L.mapbox.accessToken = 'pk.eyJ1IjoiY2hhc2VzdGFyciIsImEiOiJjaWtjczAydzkwbTFydjBrcGFmcmV6a3p4In0.7N_qPo1tQlE943MlZyFkfw';
L.mapbox.map('map', 'mapbox.streets').setView(centerArr, 12)
  .featureLayer.setGeoJSON(geojson);