import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./db/index.js";
import userRouter from "./routes/user-router.js";

const app = express();
const apiPort = 4444;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Использование существующих роутов
app.use("/", userRouter); // Запросы на взаимодействие с данными пользователя

app.listen(apiPort, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log(`Server: OK. Started on port: ${apiPort}`);
});
