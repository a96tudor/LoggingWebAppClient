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
        }
      } else {
        if (xhr.responseText != "" &&  !displayed_message) {
          alert(xhr.responseText);
          displayed_message = true;
        }
        if (xhr.status != 500) {
          document.getElementById("course-name").value = ''
          document.getElementById("email").value = ''
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
