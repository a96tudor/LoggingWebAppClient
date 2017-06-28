function start_button_press(){
  var course_name = document.getElementById("course-name").value

  if (course_name) {
    alert("All good!");
  } else {
    alert("No course name entered!");
  }
}
