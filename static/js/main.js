var pauseActive = false;
var attempts_remaining = 3;
var BASE_URL = "https://www.neural-guide.me";
var courses_list = [];

function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}

function getSelectedID(elementId) {
  var elt = document.getElementById(elementId);

  return elt.selectedIndex;
}

function start_button_press(){
  let course_name = getSelectedText("id_label_single");
  let id = read_cookie("id");

  var displayed_message = false;
  if (course_name && id) {

    var data_to_send = {
      "id": id,
      "course": course_name
    };

    var xhr = new XMLHttpRequest();
    var url = BASE_URL + "/start-work";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.status == 200) {
        if (!displayed_message) {
          displayed_message = true;
          add_cookie("done", 0, 1);
          openInNewTab(courses_list[getSelectedID("id_label_single")]["url"]);
          window.location.replace("working.html?"+id);
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

  var id = read_cookie("id");

  var displayed_message = false;
  if (confirm("You are about to submit. Are you sure you want to do this?")) {

    var data_to_send = {
      "id": id,
      "time": totalSeconds
    };

    var xhr = new XMLHttpRequest();
    var url = BASE_URL + "/stop-work";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.status == 200) {
        if (!displayed_message) {
          alert("success");
          var id = read_cookie("id");
          add_cookie("time", 0, 10);
          add_cookie("done", 1, 1);
          displayed_message = true;
          window.location.replace("main.html#start");
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
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) {
      let result = c.substring(nameEQ.length,c.length);
      return result.substring(0, result.indexOf(" expires="));
    }
  }
  return null;
}

function delete_cookie(name) {
  var expiresAt = "expires=Thu, 01 Jan 1970 00:00:01 GMT"
  document.cookie = name+"=;" + expiresAt;
}

function login_validate() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("pass").value;
  var displayed_message = false;

  if (password && email) {

    var dataToSend = {
      "email": email,
      "password": password
    };

    let xhr = new XMLHttpRequest();
    let url = BASE_URL + "/user/login";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.responseType = "json";
    xhr.onreadystatechange = function () {
      if (!xhr.response) return;
      if (xhr.status==200) {
        response = xhr.response;
        if (response["success"]) {
          alert("Login successful!");
          add_cookie("id", response["id"], 1);
          add_cookie("name", response["name"], 1);
          add_cookie("token", response["token"], 1);
          window.location.replace("main.html");
        } else {
          alert(response["message"]);
          if (response["message"]=="User not validated")
            window.location.replace("validate.html?"+response["id"]);
        }
      } else {
        alert("Something went wrong! Please contact an admin.");
      }
    };
    xhr.send(JSON.stringify(dataToSend));

  }
}

function load_courses() {

  let url = BASE_URL + "/get-courses";

  let option_open = "<option>";
  let option_close = "</option>";
  let innerHTML = "";

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = 'json';

  xhr.onreadystatechange = function () {
    if (xhr.status == 200) {
      // all good
      if (xhr.response) {
        response = xhr.response;
        for (var i = 0; i < response["courses"].length; i++) {
          innerHTML += option_open + response["courses"][i]["name"] + option_close + "\n";
          courses_list.push(response["courses"][i]);
        }
        document.getElementById("id_label_single").innerHTML = innerHTML;
        }
    } else {
      alert("Something went wrong. Please contact an admin!");
    }
  }

  xhr.send();
}

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

function logout() {
  if (confirm("Are you sure?")) {
    let id = read_cookie("id");
    let url = BASE_URL + "/user/logout";
    var dataToSend = {"id": id}

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.responseType = 'json';

    xhr.onreadystatechange = function () {
      if (!xhr.response) return;
      if (xhr.status == 200) {
        let response = xhr.response;
        if (response["success"]) {
          delete_cookie("token");
          delete_cookie("id");
          delete_cookie("name");
          window.location.replace("/");
        } else {
          alert("Something went wrong. Please contact an admin.");
        }
      } else {
        alert("Something went wrong. Please contact an admin.");
      }
    }
    xhr.send(JSON.stringify(dataToSend));
  }
}

function loadPage(page) {
  let menuTabs = {
    "start": "start.html",
    "history": loadHistorySameUser,
    "leaderboard": function() { load_HTML("stats/leaderboard"); } ,
    "account": "page-in-working.html",
    "contact": "page-in-working.html",
    "courses": function() { load_HTML("courses-full");},
    "": "start.html"
  };
  if (page in menuTabs) {
    let hash = window.location.hash.substr(1);
    if (page == hash) return;

    menuTabs[page]();

    for (var key in menuTabs) {
      if (key=="") continue;
      document.getElementById(key).classList.remove("active");
    }
    if (page!="") document.getElementById(page).classList.add("active");
    else document.getElementById("start").classList.add("active");

  } else {
    $('#main-content').load('404.html');
  }
}

function loadHistorySameUser() {
  console.log("test again");
  let url = "https://www.neural-guide.me/user/stats/history";

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  console.log("opened request")
  xhr.onreadystatechange = function() {
    console.log("received response")
    if (!xhr.response) return;
    if (xhr.status == 200 && xhr.readyState==4) {
      console.log(xhr.responseText);
      document.getElementById("main-content").innerHTML = xhr.responseText;
    } 
  }
  let dataToSend = {
    "asking": read_cookie("id"),
    "user": read_cookie("id")
  };

  xhr.send(JSON.stringify(dataToSend));
}

function load_HTML(page) {
  url = BASE_URL + "/" + page;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (!xmlHttp.response) return;
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        document.getElementById("main-content").innerHTML = xmlHttp.responseText;
  }

  xmlHttp.open("GET", url, true); // true for asynchronous
  xmlHttp.send(null);
}
