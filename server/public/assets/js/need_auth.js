import user from "./user.js";

if (localStorage.token === undefined) {
  window.location.href = "/login.html";
} else {
  let me = await user.me(localStorage.token);

  window.user = me;

  if (me.error) {
    window.location.href = "/login.html";
  }
}
