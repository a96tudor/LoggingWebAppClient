var pauseActive = false;

function start_button_press(){
  var course_name = document.getElementById("course-name").value
  var email = document.getElementById("email").value
  var displayed_message = false;

  if (course_name && email) {

    var data_to_send = {
      "email": email,
      "course": course_name
    };

    var xhr = new XMLHttpRequest();
    var url = "http://40.71.216.203/start-work";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.status == 200) {
        if (!displayed_message) {
          current_email = email;
          displayed_message = true;
          window.location.replace("working.html?"+email);
          add_cookie("email", email, 20);
          add_cookie("done", 0, 1);
        }
      } else {
        if (xhr.responseText != "" &&  !displayed_message) {
          alert(xhr.responseText);
          displayed_message = true;
        }
        if (xhr.status != 500) {
          document.getElementById("course-name").value = '';
          document.getElementById("email").value = '';
        }
      }
    };
    xhr.send(JSON.stringify(data_to_send));

  } else {
    alert("No course name entered!");
  }
}

function pause_button_press() {
  pauseActive = !pauseActive;
  if (pauseActive) {
    document.getElementById("pause-button").innerHTML = "Resume";
  } else {
    document.getElementById("pause-button").innerHTML = "Pause";
  }
}

function done_button_press() {

  var email = location.search.substr(1);
  console.log(email);

  var displayed_message = false;
  if (confirm("You are about to submit. Are you sure you want to do this?")) {

    var data_to_send = {
      "email": email,
      "time": totalSeconds
    };

    var xhr = new XMLHttpRequest();
    var url = "http://40.71.216.203/stop-work";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.status == 200) {
        if (!displayed_message) {
          alert("success");
          add_cookie("time", 0, 10);
          add_cookie("email", "", 20);
          add_cookie("done", 1, 1);
          window.location.replace("start.html");
          displayed_message = true;
        }
      } else {
        if (xhr.responseText != "" &&  !displayed_message) {
          alert("Something went wrong :(");
          displayed_message = true;
        }
      }
    };
    xhr.send(JSON.stringify(data_to_send));
  }

}

function add_cookie(name, value, exDays) {
  var d = new Date();
  d.setTime(d.getTime() + (exDays*24*60*60*1000))
  var expiresAt = " expires="+d.toUTCString();
  document.cookie = name+"="+value+expiresAt+"; path=/";
}

function read_cookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return(c.substring(nameEQ.length, c.length));
	}
  return null;
}

function delete_cookie(name) {
  var expiresAt = "expires=Thu, 01 Jan 1970 00:00:01 GMT"
  document.cookie = name+"=;" + expiresAt;
}
