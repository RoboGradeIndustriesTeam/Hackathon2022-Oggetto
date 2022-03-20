import { compareSync, genSaltSync, hashSync } from "bcrypt";
import user from "../models/userModel.js";
import jwt from "jsonwebtoken";

export default {
  /*
        Method: POST
        URL: /users/register

        Middlewares:
            console
            auth
            role("ADMIN")

        Request body:
        {
            "login": "<login>",
            "password: "<raw_password>"
        }

        Response body:
        {
            "error": <0-2>,
            <if error === 0>
            "user": { <user object> },
            "jwt": "<jwt token>"
            <endif>
        }

        Errors:
        0 - OK
        1 - Token invalid
        2 - Forbidden
        3 - User with this name already created
    */
  async register(req, res) {
    const { login, password } = req.body;

    const candidate = await user.findOne({ login });

    if (candidate) {
      return res.status(400).json({ error: 3 });
    }

    const hashed_password = hashSync(password, genSaltSync());

    const new_user = new user({
      login,
      encryptedPassword: hashed_password,
      role: "USER",
    });

    await new_user.save();

    let jwt_payload = {
      user_id: new_user._id,
    };

    let token = jwt.sign(jwt_payload, process.env.SECRET || "SECRET");

    return res.status(200).json({ error: 0, user: new_user, jwt: token });
  },

  /*
        Method: POST
        URL: /users/login

        Middlewares:
            console

        Request body:
        {
            "login": "<login>",
            "password: "<raw_password>"
        }

        Response body:
        {
            "error": <0-2>,
            <if error === 0>
            "jwt": "<jwt token>",
            "user": { <user_object> }
            <endif>
        }

        Errors:
        0 - OK
        1 - Login invalid
        2 - Password invalid
    */
  async auth(req, res) {
    const { login, password } = req.body;

    const candidate = await user.findOne({ login });

    if (!candidate) return res.status(401).json({ error: 1 });

    let is = compareSync(password, candidate.encryptedPassword);

    if (!is) return res.status(401).json({ error: 2 });

    let jwt_payload = {
      user_id: candidate._id,
    };

    let token = jwt.sign(jwt_payload, process.env.SECRET || "SECRET");

    return res.status(200).json({ error: 0, jwt: token, user: candidate });
  },

  /*
        Method: GET
        URL: /users/me

        Middlewares:
            console
            auth

        Response body:
        {
            "error": <0-1>,
            <if error === 0>
            "user": { <user object> }
            <endif>
        }

        Errors:
        0 - OK
        1 - Token invalid
    */
  async me(req, res) {
    return res.status(200).json({ error: 0, user: req.user });
  },

  /*
        Method: PATCH
        URL: /users/me

        Middlewares:
            console
            auth

        Request body:
        {
            "password?": "<new user password>",
            "old_password": "<old user password>"
        }

        Response body:
        {
            "error": <0-2>,
            <if error === 0>
            "user": { <user object> }
            <endif>
        }

        Errors:
        0 - OK
        1 - Old password invalid
        2 - Error
    */
  async changeMe(req, res) {
    try {
      const { old_password, password } = req.body;

      // Check old password
      let is = compareSync(old_password, req.user.encryptedPassword);
      if (!is) return res.status(401).json({ error: 1 });

      // Change password logic
      if (password) {
        let newHashedPassword = hashSync(password, genSaltSync());

        req.user.encryptedPassword = newHashedPassword;
        await req.user.save();
      }

      return res.status(200).json({ error: 0, user: req.user });
    } catch (e) {
      return res.status(200).json({ error: 2 });
    }
  },
  /*
        Method: POST
        URL: /users/google

        Middlewares:
            console

        Request body:
        {
            "email": "<user email>"
         }

        Response body:
        {
            "error": <0-1>,
            <if error === 0>
            "user": { <user object> },
            "jwt": "< jwt token >"
            <endif>
        }

        Errors:
        0 - OK
        1 - Email not created
    */
  async googleAuth(req, res) {
    const { email } = req.body;

    const candidate = await user.findOne({ email });

    if (!candidate) {
      return res.status(404).json({ error: 1 });
    }

    let jwt_payload = {
      user_id: candidate._id,
    };

    let token = jwt.sign(jwt_payload, process.env.SECRET || "SECRET");

    return res.status(200).json({ error: 0, user: candidate, jwt: token });
  },
};
