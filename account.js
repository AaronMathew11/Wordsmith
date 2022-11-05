document.getElementById("errorbox").style.display = "none";
document.getElementById("warnbox").style.display = "none";

function verify() {
  var errorbox = document.getElementById("errorbox");
  var name = document.getElementById("name");
  var email = document.getElementById("email");
  var pass = document.getElementById("pass").value;
  var repass = document.getElementById("repass").value;

  if (name != "" && email != "" && pass != "" && repass != "") {
    if (repass != pass) {
      document.getElementById("errorbox").style.display = "block";
    } else {
      window.open("./Choosetopic.html", "_self");
    }
  } else {
    document.getElementById("warnbox").style.display = "block";
  }
}
