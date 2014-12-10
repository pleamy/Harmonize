Parse.initialize("PtXNUBqQSWiPe2A0EnYgo6BIhru18cN0rJslkGNx", "zrTKKzn9GFqMCKsbcLoQPQIqBLe1f6oprK0I9bpK");

var ParsePlaylistData = Parse.Object.extend("ParsePlaylistData");
var parsePlaylistData = new ParsePlaylistData();
var svgContainer;
var svg;
var colors;
// var nodes;
var d3_data;
// var force;
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
					// other fields can be set just like with Parse.Object
					// 	user.set("phone", "415-392-0202");
					// 
					// user.signUp(null, {
					// 		success: function(user) {
					// 		// Hooray! Let them use the app now.
					// 	},
					// 	error: function(user, error) {
					// 		// Show the error message somewhere and let the user try again.
					// 		alert("Error: " + error.code + " " + error.message);
					// 	}
					// });

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