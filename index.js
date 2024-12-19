import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./db/index.js";
import {
	registrValidation,
	loginValidation,
} from "./validations/user-validation.js";
import {
	registr,
	login,
	auth,
	getProfileInfo,
} from "./controllers/user-controller.js";

const app = express();
const apiPort = 4444;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Роуты будут перенесены в user-router.js

// Регистрация с предварительной валидацией данных запроса
app.post("/registr", registrValidation, registr);
// Логин
app.get("/login", loginValidation, login);
// Запрос данных авторизированного пользователя
app.get("/profile", auth, getProfileInfo);
// Аутентификация
app.get("/auth", auth);

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.listen(apiPort, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log(`Server: OK. Started on port: ${apiPort}`);
});
