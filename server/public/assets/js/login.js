import user from "./user.js";

if (localStorage.token !== undefined) {
  let me = await user.me(localStorage.token);

  if (me.error === false) {
    window.location.href = "/index.html";
  }
}

let login_field = document.querySelector("#login");
let password_field = document.querySelector("#password");
let login_button = document.querySelector("#login_btn");

login_button.addEventListener("click", async () => {
  let login = login_field.value;
  let password = password_field.value;

  let resp = await user.auth(login, password);

  if (resp.error) {
    alert(resp.message);
  } else {
    localStorage.setItem("token", resp.jwt);
    window.location.href = "/index.html";
  }
});
