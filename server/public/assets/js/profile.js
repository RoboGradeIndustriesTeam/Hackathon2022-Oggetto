import user from "./user.js";

let me = await user.me(localStorage.token);

document.querySelector("#login").value = me.user.login;
document.querySelector("#email").value = me.user.email;
