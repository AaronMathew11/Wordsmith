
document.getElementById("errorbox").style.display = "none";
document.getElementById("warnbox").style.display = "none";
document.getElementById("registerBox").style.display = "none";

// const token = sessionStorage.getItem('token');
// console.log(token)

// if (token !=null) {
//   window.open("./login.html", "_self");
// }


  async function verify() {

 
    var errorbox = document.getElementById("errorbox");
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;
    var repass = document.getElementById("repass").value;

    const info = {
      name,
      email,
      password: pass,
    }


    if (name != "" && email != "" && pass != "" && repass != "") {
      if (repass != pass) {
        document.getElementById("errorbox").style.display = "block";
      } else {

        //Send Details to Server
        const req = await fetch("http://localhost:4010/register", {
          headers: {
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify(info)
        })

        const res = await req.json();
        console.log(res.flag)
        if (res.flag == false) {
          document.getElementById("errorbox").style.display = "block";
        }
        else {
          document.getElementById("registerBox").style.display = "block";
          setTimeout(() => {
            window.open("./login.html", "_self");
          }, 400)

        }

      }
    } else {
      document.getElementById("warnbox").style.display = "block";
    }
  }


  async function login() {

    var email = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;

    const info = {
      email,
      password: pass,
    }

    const req = await fetch("http://localhost:4010/login", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(info)
    })

    const res = await req.json();
    if (res.flag === false) {
      document.getElementById("warnbox").style.display = "block";

    }
    else {
      const token = res.token;
      console.log(token)
      sessionStorage.setItem("token", JSON.stringify(token))
      window.open("./Choosetopic.html","_self");

    }




  }






