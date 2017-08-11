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

function start_work(course_name, course_url) {
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
          openInNewTab(course_url);
          window.location.replace("working.html?"+id);
        }
      } else {
        if (xhr.responseText != "" &&  !displayed_message) {
          alert(xhr.responseText);
          displayed_message = true;
        }
      }
    };
    xhr.send(JSON.stringify(data_to_send));

  } else {
    alert("No course name entered!");
  }
}

function start_button_press(){
  let course_name = getSelectedText("id_label_single");

  let course_url = courses_list[getSelectedID("id_label_single")]["url"];

  start_work(course_name, course_url);
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
      "time": clock.getTime().getSeconds()
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
          window.location.replace("main.html");
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

async function openInNewTab(url) {
  try {
    var win = window.open(url, '_blank');
    win.focus();
  } catch (err){
    alert("Please enable the popups for this website!");
    await sleep(10000);
    openInNewTab(url);
  }
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

function loadPage(page, first_load) {
  let menuTabs = {
    "start": function() { load_HTML_localhost("start.html");},
    "history": loadHistorySameUser,
    "leaderboard": function() { load_HTML_from_server("stats/leaderboard"); } ,
    "account": function() {
      let id_user = read_cookie("id");
      load_HTML_from_server("/user/info?id_asker=" + id_user + "&id_user=" + id_user);
    },
    "contact": function() { load_HTML_localhost("page-in-working.html");},
    "courses": function() { load_HTML_from_server("courses-full");},
  };

  console.log(page);

  if (page in menuTabs) {
    let hash = window.location.hash.substr(1);
    if (page == hash && !first_load) return;

    console.log("Loading" + page);

    menuTabs[page]();

    for (var key in menuTabs) {
      document.getElementById(key).classList.remove("active");
    }
    if (page!="") document.getElementById(page).classList.add("active");
    else document.getElementById("start").classList.add("active");

  } else {
    $('#main-content').load('404.html');
  }
}

function loadHistorySameUser() {
  let url = "https://www.neural-guide.me/user/stats/history";

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function() {
    if (!xhr.response) return;
    if (xhr.status == 200 && xhr.readyState==4) {
      document.getElementById("main-content").innerHTML = xhr.responseText;
    }
  }
  let dataToSend = {
    "asking": read_cookie("id"),
    "user": read_cookie("id")
  };

  xhr.send(JSON.stringify(dataToSend));
}

function load_HTML_localhost(page) {
  $("#main-content").load(page);
}

function load_HTML_from_server(page) {
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

function toggleDisplayHide(toDisplay, toHide) {
  for (item in toHide) {
    $("#"+toHide[item]).hide();
  }

  for (item in toDisplay) {
    $("#"+toDisplay[item]).show();
  }
}

function updateName() {
  let newName = document.getElementById('text-name-edit').value;
  let url = BASE_URL + "/user/update/name";
  let uid = read_cookie('id');
  let dataToSend = {
      "id_updater": uid,
      "id_user": uid,
      "new_name": newName
    };

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.responseType = "json";

  xhr.onreadystatechange = function() {
    if (!xhr.response) return;
     if (xhr.status == 200) {
        let resp = xhr.response;
        if (resp["success"]) {
          flashElements(['text-name-edit', 'button-name-edit', 'general'], '#7EAD00')
          document.getElementById('nameP').innerHTML = newName;
          toggleDisplayHide(['nameP', 'edit-icon-name'],
                            ['text-name-edit', 'button-name-edit']);
        } else {
          flashElements(['text-name-edit', 'button-name-edit', 'general'], '#D93431')
          alert(resp["message"]);
        }
      } else {
        flashElements(['text-name-edit', 'button-name-edit', 'general'], '#D93431')
        alert(xhr.responseText);
      }
  };
  xhr.send(JSON.stringify(dataToSend));
}

function updatePass() {
  let oldPass = document.getElementById('old_pass').value;
  let newPass = document.getElementById('new_pass').value;
  let newPassCnf = document.getElementById('new_pass_confirm').value;
  let uid = read_cookie('id');

  if (!(newPass && newPassCnf && newPass != "" && newPassCnf != "" && newPass == newPassCnf)) {
    alert('The two passwords are invalid');
    return;
  }

  let dataToSend = {
    "old_pass": oldPass,
    "new_pass": newPass,
    "id_user": uid
  };

  let url = BASE_URL + "/user/update/password";
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.responseType = "json";

  xhr.onreadystatechange = function() {
    if (!xhr.response) return;
      if (xhr.status == 200) {
        let resp = xhr.response;
        if (resp["success"]) {
          flashElements(['password-reset-container', 'pass-confirm', 'security'], '#7EAD00')
          alert("Success!")
          toggleDisplayHide(['button-reset-pass'], ['password-reset-container', 'pass-confirm']);
        } else {
          flashElements(['password-reset-container', 'pass-confirm', 'security'], '#D93431')
          alert(resp["message"]);
        }
      } else {
        flashElements(['password-reset-container', 'pass-confirm', 'security'], '#D93431')
        alert(xhr.responseText);
      }
  };
  xhr.send(JSON.stringify(dataToSend));
}


/**
    Function that flashes a set of elements in a specific color

  @param elements   The list of elements ids that I want to flash
  @param color      The color I want them to flash in
*/
function flashElements(elements, color) {

  jQuery.fn.flash = function( color, duration ) {

    var current = this.css( 'color' );

    this.animate( { color: color }, duration / 2 );
    this.animate( { color: current }, duration / 2 );
  }

  var flash = function(elements, color) {
    var opacity = 100;
    var interval = setInterval(function() {
      opacity -= 3;
      if (opacity <= 0) clearInterval(interval);
        $(elements).css({color: color});
      }, 30)
    };

  for (var idx in elements) {
    flash("#"+elements[idx], color);
  }

}

function sendTimeUpdate(time) {
  let url = BASE_URL + "/working/update-time?";
  let id = read_cookie("id");
  url += "id=" + id;
  url += "&time=" + time.toString();

  let xhr = new XMLHttpRequest();
  xhr.open("PUT", url, true);
  xhr.send();
}

function forcedStopWork(time) {
  let url = BASE_URL + "/stop-work/forced?";
  let id = read_cookie("id");
  url += "id_asker=" + id;
  url += "&id_user=" + id;

  let xhr = new XMLHttpRequest();
  xhr.open("PUT", url, true);
  xhr.send();

  $("#warning-div").hide();
  $("#warning-message").hide();
}

function continueWork(time) {
  add_cookie("time", time, 1);

  let id = read_cookie("id");

  window.location.replace("working.html?"+id.toString());
}

function filterTableContents() {
  let filter = document.getElementById("filter-input").value.toUpperCase();
  let table = document.getElementById("table-contents");
  let trs = table.getElementsByTagName("tr");

  for (i=0; i < trs.length; i++) {
    let tds = trs[i].getElementsByTagName("td");
    var hasFilter = false;
    for (j = 0; i < tds.length; i++) {
      if (tds[j]) {
        if (tds[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
          hasFilter = true;
          break;
        }
      }
    }
    if (hasFilter) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}
