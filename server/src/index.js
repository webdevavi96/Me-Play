// require("dotenv").config()
import connectDb from "./db/db.js";
import dotenv from "dotenv";
import {app} from "./app.js";

dotenv.config({
    path: "./.env"
});

connectDb()
    .then(() => {
        app.on("error", (error) => {
            console.log("Error: ", error);
            throw (error);
        });

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Serveris running on port: ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("Mongo DB connection error!!!", err);
    })