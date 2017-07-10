let BASE_URL = "https://www.neural-guide.me";

function submit_data() {
  let pass = document.getElementById("pass").value;
  let pass_confirm = document.getElementById("pass_confirm").value;

  if (pass != pass_confirm) {
    alert("The two passwords are not the same!");
    document.getElementByID("pass").value = "";
    document.getElementByID("pass_confirm").value = "";
  } else {
    let userHash = location.search.substr(1);
    console.log(userHash);
    let url = BASE_URL + "user/validate";
    data_to_send = {
      "id": userHash,
      "pass": pass
    };
    let xhr = new XMLHttpRequest();
    let url = BASE_URL + "/login";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.status == 200) {
        // It was successful
        alert("Success!")
        window.location.replace("templates/login.html");
        return;
      }
      if (xhr.status == 400) {
        alert("User already fully configured!");
        window.location.replace("templates/login.html");
      }
      if (xhr.status == 500) {
        alert("Server error!");
      }
    }
  }


}
