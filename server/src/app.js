import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }
));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());


// Routes import
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import likedRouter from "./routes/likes.routes.js";
import channelRouter from "./routes/channels.routes.js";
import commentRouter from "./routes/comments.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/like", likedRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/channels", channelRouter);
app.use("/api/v1/comments", commentRouter);
app.use("api/v1/user/dashboard", dashboardRouter);

export { app };