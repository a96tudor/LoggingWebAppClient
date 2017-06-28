
function submitCredentials() {
  var name = document.getElementById("name").value;
  var username = document.getElementById("username").value;
  var password = document.getElementById("pass").value;
  var password_confirm = document.getElementById("pass-confirm").value;

  function validate() {
    if (name && username && password && password_confirm) {
      if (password == password_confirm) {
        return true;
      } else {
        alert("The passwords don't match!")
        document.getElementById("pass").value = "";
        document.getElementById("pass-confirm").value = "";
        return false;
      }
    } else {
      alert("All fields are mandatory!")
      return false;
    }
  }

  if (validate()) {
    alert("Signup completed!")
    return true;
  } else {
    return false;
  }

}
