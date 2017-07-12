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
      let url = BASE_URL + "/validate-user";
      let xhr = new XMLHttpRequest();
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.open("POST", url, true);
      xhr.onreadystatechange = function () {
        console.log("STATUS=" + xhr.status);
        console.log("RESPONSE_TEXT=" + xhr.responseText);
      };
      xhr.send(JSON.stringify(dataToSend));
    } else {
      alert("The two passwords don't coincide!")
    }
  } else {
    alert("Please enter a password!");
  }
}
