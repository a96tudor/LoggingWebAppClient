var BASE_URL = "https://www.neural-guide.me";

function submitData() {
  let pass = document.getElementById("pass").value;
  let pass_confirmation = document.getElementById("pass_confirm").value;

  if (pass && pass_confirmation) {
    if (pass == pass_confirmation) {
      let dataToSend = {
        "id": location.search.substr(1),
        "pass": pass
      };
      let url = BASE_URL + "/user-validate";
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
      xhr.onreadystatechange = function () {
        if (xhr.status == 200) {
          // All good, redirecting to login
          alert("Validation successful! Redirecting to login...");
          window.location.replace("login.html");
        } else if (xhr.status==500) {
          alert("Something went wrong. Please contact an administrator.");
        } else {
          if (xhr.response == "User's password already set") {
            alert("You have already been validated. Redirecting to login...");
            window.location.replace("login.html");
          } else {
            alert("Something went wrong. Please contact an administrator.");
          }
        }
      };
      xhr.send(JSON.stringify(dataToSend));
    } else {
      alert("The two passwords don't coincide!")
    }
  } else {
    alert("Please enter a password!");
  }
}
