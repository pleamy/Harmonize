"use strict";

var accessToken = null;
var playlistFields = { fields:'tracks.offset,tracks.next,tracks.items(track(id,name,artists))' };
var playlistFields_2 = {};
var playlistFields_3 = {};
var playlistFields_4 = {};

function error(msg) {
    info(msg);
}
function info(msg) {
    $("#info").text(msg);
}
function authorizeUser() {
    var client_id = '60516544c7cd4725a214c38012bd7fda';
    var redirect_uri = 'http://harmonize.parseapp.com';
    var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
        '&response_type=token' +
        '&scope=playlist-read-private' +
        '&redirect_uri=' + encodeURIComponent(redirect_uri);
    document.location = url;
} 
function parseArgs() {
    var hash = location.hash.replace(/#/g, '');
    var all = hash.split('&');
    var args = {};
    _.each(all, function(keyvalue) {
        var kv = keyvalue.split('=');
        var key = kv[0];
        var val = kv[1];
        args[key] = val;
    });
    return args;
}
function fetchCurrentUserProfile(callback) {
    var url = 'https://api.spotify.com/v1/me';
    callSpotify(url, null, callback);
}
function fetchStarredItems(id, callback) {
    var url = 'https://api.spotify.com/v1/users/' + id + '/starred';
	// console.log("The user's ID is " + id + ".")
    callSpotify(url, playlistFields, callback);
}
function fetchPlaylists(id, callback) {
    var url = 'https://api.spotify.com/v1/users/' + id + '/playlists?offset=0&limit=50';
	// console.log("The user's ID is " + id + ".")
    callSpotify(url, playlistFields_2, callback);
}
function fetchPlaylistItems(id, callback) {
    var url = 'https://api.spotify.com/v1/users/' + global_user_id + '/playlists/' + playlist_id + '/tracks';
    callSpotify(url, playlistFields_3, callback);
}
function fetchDisplayPics(id, callback) {
	var url = 'https://api.spotify.com/v1/me';
	callSpotify(url, playlistFields_4, callback);	
}
function callSpotify(url, data, callback) {
    $.ajax(url, {
        dataType: 'json',
        data: data,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(r) {
            callback(r);
        },
        error: function(r) {
            callback(null);
        }
    });
}

/* playlist.js commented code */