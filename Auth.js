
document.getElementById("errorbox").style.display = "none";
document.getElementById("warnbox").style.display = "none";
document.getElementById("registerBox").style.display = "none";
document.getElementById("invalidcred").style.display = "none";
document.getElementById("userexists").style.display = "none";
document.getElementById("passshort").style.display = "none";


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

    document.getElementById("warnbox").style.display = "none";

    if (repass != pass) {
      document.getElementById("errorbox").style.display = "block";

      // setTimeout(()=>{
      //   document.getElementById("errorbox").style.display = "none";
      // },1000)
    } else {
      document.getElementById("errorbox").style.display = "none";
      if (pass.length > 8) {
        document.getElementById("passshort").style.display = "none";
        //Send Details to Server  
        const req = await fetch("https://wordsmithvocab.herokuapp.com/register", {
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
            document.getElementById('logindiv').style.display = 'block'
            document.getElementById('registerdiv').style.display = 'none'
            document.getElementById("registerBox").style.display = "none";
          }, 400)
        

        }

      }
      else {
        document.getElementById("passshort").style.display = "block";

      }
    }


  }
  else{
    document.getElementById("warnbox").style.display = "block";

  }
 

}




async function login() {

  var email = document.getElementById("emailLogin").value;
  var pass = document.getElementById("passLogin").value;

  const info = {
    email,
    password: pass,
  }
  document.getElementById("invalidcred").style.display = "none";

  if (email != "" && pass != "") {
    document.getElementById("warnbox").style.display = "none";
    const req = await fetch("https://wordsmithvocab.herokuapp.com/login", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(info)
    })

    const res = await req.json();
    if (res.flag === false) {
      document.getElementById("invalidcred").style.display = "block";

    }
    else {
      document.getElementById("invalidcred").style.display = "none";
      const token = res.token;
      console.log(token)
      localStorage.setItem("token", JSON.stringify(token))
      const topicVerifyFetch = await fetch("https://wordsmithvocab.herokuapp.com/getTopics", {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ token })
      })

      const response = await topicVerifyFetch.json();
      if (response.topics.length > 0) {
        window.open("./home.html", "_self")
      }
      else {
        window.open("./Choosetopic.html", "_self");
      }


    }


  }
  else{

    document.getElementById("warnbox").style.display = "block";

  }



}






