var current_email = "";

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
    var url = "http://127.0.0.1:5000/start-work";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.status == 200) {
        if (!displayed_message) {
          current_email = email;
          displayed_message = true;

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
  console.log(totalSeconds);
  pauseActive = !pauseActive;
  if (pauseActive) {
    document.getElementById("pause-button").innerHTML = "Resume";
  } else {
    document.getElementById("pause-button").innerHTML = "Pause";
  }
}
