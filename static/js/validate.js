function submit_data() {
  var pass = document.getElementById("pass").value;
  var pass_confirm = document.getElementById("pass_confirm").value;

  console.log("submitting")

  if (pass != pass_confirm) {
    alert("The two passwords are not the same!");
    document.getElementByID("pass").value = "";
    document.getElementByID("pass_confirm").value = "";
    return;
  }

  var user_hash = location.search.substr(1);
  console.log(user_hash);
}
