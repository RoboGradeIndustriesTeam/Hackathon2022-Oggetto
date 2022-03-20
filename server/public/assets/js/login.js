import user from "./user.js";

if (localStorage.token !== undefined) {
  let me = await user.me(localStorage.token);

  if (me.error === false) {
    window.location.href = "/index.html";
  }
}

let onSignIn = async (googleUser) => {
  let profile = googleUser.getBasicProfile();
  console.log("Email: " + profile.getEmail());

  let resp = await user.authWithGoogle(profile.getEmail());

  if (resp.error) {
    alert(resp.message);
  } else {
    alert(`Привет, ${resp.user.login}`);
    localStorage.setItem("token", resp.jwt);
    window.location.href = "/index.html";
  }
};

let googleUser = {};
let auth2;
const startApp = function () {
  gapi.load("auth2", function () {
    auth2 = gapi.auth2.init({
      client_id:
        "416597751017-dnu57egf81un4ao5b1gc3n5ead0smjht.apps.googleusercontent.com",
      cookiepolicy: "single_host_origin",
    });
    attachSignin(document.getElementById("customBtn"));
  });
};

function attachSignin(element) {
  console.log(element.id);
  auth2.attachClickHandler(
    element,
    {},
    function (googleUser) {
      onSignIn(googleUser);
    },
    function (error) {
      console.log(error);
    }
  );
}

startApp();

$("#login_btn").click(async () => {
  let login = $("#login").val();
  let password = $("#password").val();

  let resp = await user.auth(login, password);

  if (resp.error) {
    alert(resp.message);
  } else {
    localStorage.setItem("token", resp.jwt);
    alert(`Привет, ${login}`);
    window.location.href = "/index.html";
  }
});
