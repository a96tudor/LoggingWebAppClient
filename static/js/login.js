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
}
