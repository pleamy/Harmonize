Parse.initialize("PtXNUBqQSWiPe2A0EnYgo6BIhru18cN0rJslkGNx", "zrTKKzn9GFqMCKsbcLoQPQIqBLe1f6oprK0I9bpK");

var ParsePlaylistData = Parse.Object.extend("ParsePlaylistData");
var parsePlaylistData = new ParsePlaylistData();



var svgContainer;
var svg;
var colors;

var nodes;
var d3_data;
var force;
var global_user_id;

$(document).ready(

    function() {
        var args = parseArgs();
        if ('access_token' in args) {
            accessToken = args['access_token'];
			console.log(accessToken);
            $("#go").hide();
            info('Getting your user profile');
            fetchCurrentUserProfile(function(user) {
                if (user) {
	
	
					var Parseuser = new Parse.User();

					Parseuser.set("username", "" + user.email + "");
					
					Parseuser._sessionToken = accessToken;
									// user.set("password", "password");
					
	
					Parse.User.become(accessToken).then(function (Parseuser) {	
					  // The current user is now set to user.
					}, function (error) {
						console.log("Couldn't be validated");
					  // The token could not be validated.
					});

					// 
					// 				// other fields can be set just like with Parse.Object
					// 				user.set("phone", "415-392-0202");
					// 
					// 				user.signUp(null, {
					// 				  success: function(user) {
					// 				    // Hooray! Let them use the app now.
					// 				  },
					// 				  error: function(user, error) {
					// 				    // Show the error message somewhere and let the user try again.
					// 				    alert("Error: " + error.code + " " + error.message);
					// 				  }
					// 				});
	
	
	
					console.log(user);
					global_user_id = user.id;
					parsePlaylistData.save({userName: "" + user.display_name + ""});
					// parsePlaylistData.save({userId: "" + user.id + ""});
					var name = user.display_name.split(" ", 2); //Store the first and last name in an array
					
					var firstName = name[0]; // set the first name as variable
                    $("#who").text(firstName); //only display the first name
                    // info('Getting your starred playlist');
					
					
					// Forbidden Image 
					
					// fetchDisplayPics(user.id, function(data){
					// 	console.log(data.images[0].url);
					// 	$("#picid").html("<img src=" + data.images[0].url + "/>")
					// 	
					// })
					
					fetchPlaylists(user.id, function(data) {
					    if (data) {
							// console.log(data);
							// showPlaylistData(data);
							
							
							
						} else {
					        error("Trouble getting the playlists");
					    }
					});
					
					
  					fetchStarredItems(user.id, function(data) {
  						if (data) {
  							// console.log(data);	
  							svg = d3.select("#main").append("svg:svg").attr("width",600).attr("height", 600);
  							colors = d3.scale.category20();
  							force = d3.layout.force().gravity(0.13)
  													 .charge(-30)
  													 .size([600, 600]);
  							nodes = force.nodes(), centers = [];
  							// WORKS: USES MAP
  							// svgContainer = d3.select("#main").append("svg").attr("width",800).attr("height",800)
  							showTracks(data.tracks);
							
							// Save Data to Parse
							
							// var TestObject = Parse.Object.extend("TestObject");
							// var testObject = new TestObject();
							// testObject.save({foo: "bar"}).then(function(object) {
							//   alert("yay! it worked");
							// });
							
						
							// console.log(data);
							parsePlaylistData.save(data.tracks);
							
					
							
							
							
  						} else {
  							error("Trouble getting the starred playlist");
  						}
                    });
                } else {
                    error("Trouble getting the user profile");
                }
            });
        } else {
            $("#go").show();
            $("#go").on('click', function() {
                authorizeUser();
            });
        }
    }
);

"use strict";

var accessToken = null;
var playlistFields = {
    fields:'tracks.offset,tracks.next,tracks.items(track(id,name,artists))'
};
var playlistFields_2 = {};
var playlistFields_3 = {};
var playlistFields_4 = {};
var trackFields = {
    fields:'offset,next,items(track(name,artists))'
};
var trackFields_2 = {};

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

// START ONCE FUNCTIONING CODE

// function showPlaylistData(playlists) {  
// 	
// 	var genre
// 	var playlist_list = playlists.items;
// 	var playlist_count = playlists.total;
// 	
// 	
// 	$(playlist_list).each(function(i){
// 		playlist_id = playlist_list[i].id;
// 		
// 		if (playlist_list[i].public) {
// 					console.log(playlist_list[i]);
// 
// 		
// 		fetchPlaylistItems(playlist_id, function(data) {
// 		    if (data) {
// 				// console.log(data);	
// 				
// 				
// 				var playlist_data = data.items;
// 		
// 				
// 				// $(playlist_data).each(function(i){
// 				// 	
// 				// 	var spotify_artist_id = playlist_data[i].track.artists[0].id;
// 				// 	var echonest = "http://developer.echonest.com/api/v4/artist/profile?api_key=V67QTPVRZDSNCC4AW&id=spotify:artist:" + spotify_artist_id + "&bucket=genre";
// 				// 	  
// 				// 	$.getJSON( echonest, {
// 				// 	    format: "json"
// 				// 	  })
// 				// 	    .done(function(data) {
// 				// 		genre = data.response.artist.genres;
// 				// 
// 				// 			$(genre).each(function(i){
// 				// 
// 				// 				 genreList.push(genre[i].name);
// 				// 
// 				// 
// 				// 			                        // update Map
// 				// 			                        if (Map[genre[i].name] == undefined) {
// 				// 			                            Map[genre[i].name] = 1;
// 				// 			                            mapSize++;
// 				// 			                        }
// 				// 			                        else {
// 				// 			                            Map[genre[i].name]++;
// 				// 			                        }
// 				// 				var radius = Map[genre[i].name];
// 				// 
// 				// 				// console.log(radius);
// 				// 				// console.log(Map.length); 
// 				// 				nodes.push( {name: genre[i].name, r: radius/10, x: 800 / 2 + offset(), y: 800 / 2 + offset(), color: colors(1)});
// 				// 				// d3_data.push();
// 				// 			});
// 				// 
// 				// 			function offset() {
// 				// 			        return Math.random() * 100;
// 				// 			}
// 				// 		});
// 				// });
// 				
// 				
// 			} else {
// 		            		error("Trouble getting your tracks");
// 		        	}	
// 			
// 			
// 		});
// 
// 	});
					
	 // if (playlists.next) { // If there's more, repeat
	 //        callSpotify(playlists.next, trackFields_2, function(playlists) {
	 //            showPlaylistData(playlists);
	 //        });
	 // }
	 // 							}

// END ONCE FUNCTIONING CODE


var genreList = [];
var Map = {};
var mapSize = 0;
var d3_genre = [];
var playlist_id;
var genres = [];
var d3Map = d3.map();

function showTracks(tracks) {
	                                       // console.log(tracks);
	var genre;
    var list = $("#item-list");
    var entries = d3.entries(tracks.items); // console.log('d3 entries', entries);
                                            // console.log('show tracks', tracks);
    if (tracks.offset == 0) {
        $("#main").show();
        $("#intro").hide();
        $("#item-list").empty();
        info("");
    }
    _.each(tracks.items, function(item) {
        var artistName = item.track.artists[0].name;
		var spotify_artist_id = item.track.artists[0].uri;
		var track_id = item.track.id;
		var artist;
		var div;
		var itemElement;
		// var Map = {};
		var echonest = "http://developer.echonest.com/api/v4/artist/profile?api_key=V67QTPVRZDSNCC4AW&id=spotify:artist:" + spotify_artist_id + "&bucket=genre";
		$.getJSON( echonest, {
		    format: "json"
		}).done(function(data) {
			genre = data.response.artist.genres;
			
			$(genre).each(function(i) {

                var gen = genre[i].name;
                var radius;
				
				if ((d3Map.get(gen) == undefined) || (!d3Map.has(gen))) {
					d3Map.set(gen, 1);
				} else {
					var mapVal = d3Map.get(gen);
					mapVal++;
					d3Map.remove(gen);
					d3Map.set(gen, mapVal);
				}

                if (Map[gen] == undefined) {
                    Map[gen] = 1;
                    radius = Map[gen];
                    genres[mapSize] = gen;
                    mapSize++;

					
  
                } else {
                    Map[gen]++;
                    radius = Map[gen];
                    // console.log(Map[gen]);
                    
                    // var nodeArray = force.nodes();
                    // for (var i = 0; i < nodes.length; i++) {
                    //     if (nodes[i].genre == gen) {
                    //         nodes[i].r = Map[gen];
                } 
                nodes.push( {
                		genre: gen, r: Map[gen], x: 800 / 2 + offset(), y: 800 / 2 + offset(), color: d3.rgb(245, 135, 54) 
                	} );
			});

            function offset() {
			     return Math.random() * 100;
		    }

		    // var d3Vals = d3Map.values();
		    // console.log(d3Vals);
		    // d3.sort(d3Vals);
		    // console.log(d3Vals);



			//APPEND GENRES OF EACH ARTIST OF EACH TRACK TO LIST

			// itemElement = $("<div>").text(artistName).css("font-weight", "bold");
			//     list.append(itemElement);   
			//     $(genre).each(function(index) {
			//          list.append('<div id="div'+ index +'" />' + 
			//			genre[index].name); })
			
			// for (key in Map) {
			// 	if (!d3Map.has(key)) {
			// 		d3Map.set(key, Map[key]);
			// 	}
			// }
			// console.log(d3Map);
			// console.log(d3Map.keys());

			// var mapKeys = d3Map.keys();
			// console.log(d3Map.values());

			// for (key in Map) {
			// 	if (!d3Map.has(key)) {
			// 		d3Map.set(key, Map[key]);
			// 	}
			// }


			// console.log(d3Map.keys());
			// console.log(d3Map.values());

			var mapKeys = d3Map.keys();
			// console.log(mapKeys);

			// for (key in mapKeys) {
			// 	console.log(mapKeys[key]);
			// }

			// for (key in mapKeys) {
			// 	console.log(d3Map.get(key));
			// }


			// console.log(d3Map.values());
			// console.log(d3Map.keys());

			// for (key in d3Map) {
			// 	console.log(d3Map.get(key));
			// }
			
			
			// for (key in mapKeys) {
			// 	while (!d3Map.empty()) {
			// 		var d3key = mapKeys[key];
			// 		var keyVal = d3Map.get(d3key);
				

			// 		// console.log(keyVal);
			// 		nodes.push( {
			// 			genre: key, r: keyVal, x: 800 / 2 + offset(), y: 800 / 2 + offset(), color: d3.rgb(245, 135, 54)
			// 		});
			// 		d3Map.remove(d3key);
			// 		// console.log(d3Map.size());
			// 	}
			// 	// 	d3Map.remove(key);

			// 	// }
			// }


			

				// if (key != 0) {
				// 	var value = Map[key];
					
    //             	key = 0;
    //             	Map[key] = 0;
				// }
				// if (i == mapSize - 1) break;
			//}

		    svg.selectAll("circle")
		        .data(nodes).enter()
		        .append("circle")
		        .attr("class", "node")
		            // .attr("cx", function(d) {return d.x;})
		            // .attr("cy", function(d) {return d.y;})
		        .attr("fill", function(d){return d.color;})
		        .attr("r", 1e-6).transition()
		        .attr("r", function(d) { return d.r; })
		
			svg.selectAll("circle")
				.on('mouseover', function (d){
					d3.select(this).style({opacity:'0.6'});
					d3.select("#genre_title").text(d.genre);
				})
				.on('mouseout', function (d){
					d3.select(this).style({opacity:'1'});
					d3.select("#genre_title").text("");
				})
               
		    force.on("tick", function(e) {
			    svg.selectAll("circle")
				    .attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; });
			});	
			force.start();
		});	
	});


	//WORKS EXCEPT FOR TEXT (USES MAP RATHER THAN DYNAMIC FUNCTION)

	//   var circle = svgContainer
	// 		.append("circle")
	//      .attr("cx", Math.random() * (700 - 100) + 100)
	//      .attr("cy", Math.random() * (700 - 100) + 100)
	//      .attr("r", function(d) { return Map[key] * 3;})
	//      .attr("opacity", 0.5)
	//      .style("fill", "blue");	
	// 
	// var textLabels = svgContainer
	// 		.append("text")
	// 		.attr("cx", Math.random() * (625 - 100) + 100)
	//      .attr("cy", Math.random() * (625 - 100) + 100)
	// 		.text(function(d) { return d.name; })
	// 		.attr("font-family", "sans-serif")
	// 		.attr("font-size", "20px")
	// 		.attr("fill", "red")
	
    if (tracks.next) {
        callSpotify(tracks.next, trackFields, function(tracks) {
            showTracks(tracks);
        });		
    }

	// GET TOTAL GENRES IN PLAYLIST
	var genre_menu = d3.map(Map);
	var genre_values = genre_menu.values();
	var count = 0;

	for (var m = 0; m < genre_menu.size(); m++) {
		var new_data = genre_values[m];
		count += new_data;
	}
}

// $.ajax({
// 
//   // The 'type' property sets the HTTP method.
//   // A value of 'PUT' or 'DELETE' will trigger a preflight request.
//   type: 'GET',
// 
//   // The URL to make the request to.
//   url: 'http://developer.echonest.com/aVRZDSNCC4AW&id=spotify:artist:1Cs0zKBU1kc0i8ypK3B9ai&bucket=genre',
// 
//   // The 'contentType' property sets the 'Content-Type' header.
//   // The JQuery default for this property is
//   // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
//   // a preflight. If you set this value to anything other than
//   // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
//   // you will trigger a preflight request.
//   contentType: 'text/plain',
// 
//   xhrFields: {
//     // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
//     // This can be used to set the 'withCredentials' property.
//     // Set the value to 'true' if you'd like to pass cookies to the server.
//     // If this is enabled, your server must respond with the header
//     // 'Access-Control-Allow-Credentials: true'.
//     withCredentials: false
//   },
// 
//   headers: {
//     // Set any custom headers here.
//     // If you set any non-simple headers, your server must include these
//     // headers in the 'Access-Control-Allow-Headers' response header.
//   },
// 
//   success: function() {
//     // Here's where you handle a successful response.
// 	console.log("works")
//   },
// 
//   error: function() {
//     // Here's where you handle an error response.
//     // Note that if the error was due to a CORS issue,
//     // this function will still fire, but there won't be any additional
//     // information about the error.
// 		console.log("Something went wrong...")
//   }
// });

// var test_data = Parse.Object.extend("parsePlaylistData");
// var query = new Parse.Query(ParsePlaylistData);
// query.get({
//   success: function(parsePlaylistData) {
// 	console.log(parsePlaylistData);
//     // The object was retrieved successfully.
//   },
//   error: function(object, error) {
//     // The object was not retrieved successfully.
//     // error is a Parse.Error with an error code and message.
//   }
// });