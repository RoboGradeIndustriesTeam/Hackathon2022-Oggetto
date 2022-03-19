const user = require("../lib/user.js")
const event = require("../lib/event.js")

let VALID_LOGIN = "admin";
let VALID_PASSWORD = "admin";

let FAKE_LOGIN = "fake";
let FAKE_PASSWORD = "fake";
let FAKE_TOKEN = "fake";
let FAKE_ID = "fake";

describe("User authorization", () => {
    test(`Login: ${VALID_LOGIN}:${VALID_PASSWORD} (valid data)`, async () => {
        let resp = await user.auth(VALID_LOGIN, VALID_PASSWORD)
        expect(resp.error).toBe(false)
        expect(resp.user).not.toBe(undefined)
        expect(resp.jwt).not.toBe(undefined)
        expect(resp.message).toBe(undefined)
    })

    test(`Login: ${FAKE_LOGIN}:${FAKE_PASSWORD} (fake data)`, async () => {
        let resp = await user.auth(FAKE_LOGIN, FAKE_PASSWORD)
        expect(resp.error).toBe(true)
        expect(resp.user).toBe(undefined)
        expect(resp.message).not.toBe(undefined)
    })
    
    test(`Me: ${VALID_LOGIN}:${VALID_PASSWORD} (valid token)`, async () => {
        let auth_resp = await user.auth(VALID_LOGIN, VALID_PASSWORD)

        expect(auth_resp.error).toBe(false)
        expect(auth_resp.user).not.toBe(undefined)
        expect(auth_resp.jwt).not.toBe(undefined)
        expect(auth_resp.message).toBe(undefined)

        let me_resp = await user.me(auth_resp.jwt)

        expect(me_resp.user).not.toBe(undefined)
        expect(me_resp.message).toBe(undefined)
        expect(me_resp.error).toBe(false)
    })

    test(`Me ${FAKE_TOKEN} (fake token)`, async () => {
        let me_resp = await user.me(FAKE_TOKEN)

        expect(me_resp.user).toBe(undefined)
        expect(me_resp.message).not.toBe(undefined)
        expect(me_resp.error).toBe(true)
    })

    test(`Patch me: ${VALID_LOGIN}:${VALID_PASSWORD} (valid data)`, async () => {
        let auth_resp = await user.auth(VALID_LOGIN, VALID_PASSWORD)

        expect(auth_resp.error).toBe(false)
        expect(auth_resp.user).not.toBe(undefined)
        expect(auth_resp.jwt).not.toBe(undefined)
        expect(auth_resp.message).toBe(undefined)

        let me_resp = await user.changeMe(auth_resp.jwt, VALID_PASSWORD, VALID_PASSWORD)

        expect(me_resp.user).not.toBe(undefined)
        expect(me_resp.message).toBe(undefined)
        expect(me_resp.error).toBe(false)
    })

    test(`Patch me: ${VALID_LOGIN}:${VALID_PASSWORD} (not valid old password)`, async () => {
        let auth_resp = await user.auth(VALID_LOGIN, VALID_PASSWORD)

        expect(auth_resp.error).toBe(false)
        expect(auth_resp.user).not.toBe(undefined)
        expect(auth_resp.jwt).not.toBe(undefined)
        expect(auth_resp.message).toBe(undefined)

        let me_resp = await user.changeMe(auth_resp.jwt, FAKE_PASSWORD, FAKE_PASSWORD)

        expect(me_resp.user).toBe(undefined)
        expect(me_resp.message).not.toBe(undefined)
        expect(me_resp.error).toBe(true)
    })

    test(`Patch me: ${VALID_LOGIN}:${VALID_PASSWORD} (without old password)`, async () => {
        let auth_resp = await user.auth(VALID_LOGIN, VALID_PASSWORD)

        expect(auth_resp.error).toBe(false)
        expect(auth_resp.user).not.toBe(undefined)
        expect(auth_resp.jwt).not.toBe(undefined)
        expect(auth_resp.message).toBe(undefined)

        let me_resp = await user.changeMe(auth_resp.jwt, undefined, FAKE_PASSWORD)

        expect(me_resp.user).toBe(undefined)
        expect(me_resp.message).not.toBe(undefined)
        expect(me_resp.error).toBe(true)
    })
})

describe("Events testing",() => {
    test("Get all (real token)", async () => {
        let token = (await user.auth(VALID_LOGIN, VALID_PASSWORD)).jwt
        let resp = await event.getAll(token)

        expect(resp.message).toBe(undefined)
        expect(resp.error).toBe(false)
        expect(resp.events).not.toBe(undefined)
    })

    test("Get all (fake token)", async () => {
        let resp = await event.getAll(FAKE_TOKEN)

        expect(resp.message).not.toBe(undefined)
        expect(resp.error).toBe(true)
        expect(resp.events).toBe(undefined)
    })

    test("Get one (real token, real id)", async () => {
        let token = (await user.auth(VALID_LOGIN, VALID_PASSWORD)).jwt
        let resp = await event.getAll(token)

        if (resp.events.length !== 0) {
            let id = resp.events[0]._id

            let one_resp = await event.getByID(token, id)

            expect(one_resp.event).not.toBe(undefined)
            expect(one_resp.error).toBe(false)
            expect(one_resp.message).toBe(undefined)
        }
    })

    test("Get one (real token, fake id)", async () => {
        let token = (await user.auth(VALID_LOGIN, VALID_PASSWORD)).jwt
        let one_resp = await event.getByID(token, FAKE_ID)

        expect(one_resp.event).toBe(undefined)
        expect(one_resp.message).not.toBe(undefined)
        expect(one_resp.error).toBe(true)
    })
})

console.log("Last data: ")

let data = {
    VALID_LOGIN,
    VALID_PASSWORD,
    FAKE_LOGIN,
    FAKE_PASSWORD,
    FAKE_TOKEN,
    FAKE_ID
}

console.table(data)