const config = require("./config")
const fetch = require("node-fetch")
module.exports = {
    async auth(login, password) {
        let url = `${config.baseUrl}/users/login`
        let body = JSON.stringify({
            login,
            password
        })

        try {
            let resp = await fetch(url, {method: "POST", body, headers: {"Content-Type": "application/json"}})

            let data = await resp.json()

            if (data.error === 1) {
                return {jwt: undefined, user: undefined, message: "Логин не верный", error: true}
            } else if (data.error === 2) {
                return {jwt: undefined, user: undefined, message: "Логин не верный", error: true}
            } else if (data.error === 0) {
                return {jwt: data.jwt, user: data.user, message: undefined, error: false}
            }
        } catch (e) {
        }
    },
    async me(token) {
        let url = `${config.baseUrl}/users/me`

        try {
            let resp = await fetch(url, {method: "GET", headers: {"Authorization": `Bearer ${token}`}})

            let data = await resp.json()

            if (data.error === 1) {
                return {user: undefined, message: "Токен не верный", error: true}
            }
            else if (data.error === 0) {
                return {user: data.user, message: undefined, error: false}
            }
        } catch (e) {
        }
    },
    async changeMe(token, old_pwd, new_pwd) {
        let url = `${config.baseUrl}/users/me`

        try {
            let resp = await fetch(url, {method: "PATCH", body: JSON.stringify({
                    old_password: old_pwd,
                    password: new_pwd
                }), headers: {"Authorization": `Bearer ${token}`, "Content-Type": "application/json"}})

            let data = await resp.json()

            if (data.error === 1) {
                return {user: undefined, message: "Токен не верный", error: true}
            }
            else if (data.error === 2) {
                return {user: undefined, message: "Ошибка", error: true}
            }
            else if (data.error === 0) {
                return {user: data.user, message: undefined, error: false}
            }
        } catch (e) {
        }
    }

}