import { config } from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import eventRouter from "./routes/eventRouter.js";
import consoleMiddleware from "./middlewares/consoleMiddleware.js";
import cors from "cors";
import user from "./models/userModel.js";
import bcrypt, { genSaltSync, hashSync } from "bcrypt";
import AdminJS from "adminjs";
import AdminJSUpload from "@adminjs/upload";
import AdminJSMongoose from "@adminjs/mongoose";
import AdminJSExpress from "@adminjs/express";

import event from "./models/eventModel.js";

config();
const app = express();

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || "80";
const mongo = process.env.MONGO || "mongodb://localhost/hackathon";
const admin_default_login = process.env.ADMIN_DEFAULT_LOGIN || "admin";
const admin_default_password = process.env.ADMIN_DEFAULT_PASSWORD || "admin";

await mongoose.connect(mongo);
AdminJS.registerAdapter(AdminJSMongoose);

const adminJs = new AdminJS({
  rootPath: "/admin",
  branding: {
    companyName: "Oggeto",
    logo: false,
  },
  resources: [
    {
      resource: user,
      options: {
        properties: {
          encryptedPassword: {
            isVisible: false,
          },
          password: {
            type: "string",
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
          },
          city: {
            availableValues: [
              { value: "nvch", label: "Новочеркасск" },
              { value: "tagan", label: "Таганрог" },
            ],
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: hashSync(request.payload.password, 10),
                  password: undefined,
                };
              }
              return request;
            },
          },
        },
      },
    },
    {
      resource: event,
      options: {
        properties: {
          date: { type: "datetime" },
          link: { required: false },
        },
      },
      features: [
        // AdminJSUpload({
        //     provider: { local: { bucket: 'public'} },
        //     properties: {
        //         key: 'fileUrl',
        //         mimeType: 'image/png'
        //     },
        //     uploadPath: (record, filename) => `${record.id()}.${filename.split(".")[filename.split(".").length - 1]}`
        // })
      ],
    },
  ],
});

const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (login, password) => {
    const user_ = await user.findOne({ login });
    if (user_) {
      const matched = await bcrypt.compare(password, user_.encryptedPassword);
      if (matched) {
        return user_;
      }
    }
    return false;
  },
  cookiePassword: "some-secret-password-used-to-secure-cookie",
});

app.use(consoleMiddleware);
app.use(bodyParser.json());
app.use(adminJs.options.rootPath, router);
app.use(cors());
app.use(express.static("public"));
app.use("/users", userRouter);
app.use("/events", eventRouter);

const candidate = await user.findOne({ login: admin_default_login });

if (!candidate) {
  let admin = new user({
    login: admin_default_login,
    encryptedPassword: hashSync(admin_default_password, genSaltSync()),
    role: "ADMIN",
  });

  await admin.save();
}

app.listen(port, host, () =>
  console.log(`Application started on http://${host}:${port}`)
);
