import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./db/index.js";
import userModel from "./models/user-model.js";

const app = express();
const apiPort = 4444;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Логин
// app.get('/login', ...)

// Регистрация
// app.post('/registr', ...)

// Аутентификация

// Временный роут
app.get("/", (req, res) => {
	res.send("Hello world!");
});

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.listen(apiPort, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log(`Server: OK. Started on port: ${apiPort}`);
});
