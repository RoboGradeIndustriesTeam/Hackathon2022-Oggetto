import user from "./user.js";

if (localStorage.token !== undefined) {
  let me = await user.me(localStorage.token);

  if (me.error === false) {
    window.location.href = "/index.html";
  }
}

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
