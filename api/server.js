import express from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import DB from "./models/index.js";
import AUTHENTICATION from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';

const app = express();

dotenv.config();

let corsOptions = {
    origin:["http://localhost:3000"],
};

app.use(cors(corsOptions));
// parse request with content-type "application/json"
app.use(bodyParser.json());
// parse request with content-type "application/x-www-form-urlencoded"
app.use(bodyParser.urlencoded({extended: true}));

DB.mongoose.connect(process.env.CONNECTION_URL)
.then(() =>{
    console.log("Connected to DB successfully");
})
.catch(err =>{
    console.log("error", err.message);
});

app.use("/api", AUTHENTICATION);
app.use("/api", userRoutes);
app.use("/api", chatRoutes);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

const PORT  = process.env.PORT ?? 8080;
app.listen(PORT, () =>{
    console.log('listening on port', PORT)
});