var attempts_remaining = 3;

function validate() {
  var username = document.getElementById("user").value;
  var password = document.getElementById("pass").value;

  if (username == "admin" && password=="pass") {
    alert("Login Successfully")
    send_request(JSON.stringify({"username": username, "password": password}))
    return true
  } else {
    attempts_remaining--;
    alert("Incorrect credentials. You have only " + attempts_remaining + " attempts left")

    if (attempts_remaining == 0) {
      document.getElementById("user").value = "Username";
      document.getElementById("pass").value = "Password";

      document.getElementById("user").disabled = true;
      document.getElementById("pass").disabled = true;
      document.getElementById("submit").disabled = true;

      return false
    }

  }

  function send_request(data) {
    var xhr = new XMLHttpRequest();
    var url = "http://127.0.0.1:5000/validate";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          console.log(json.email + ", " + json.password);
      }
    };
    xhr.send(data);
  }


}
