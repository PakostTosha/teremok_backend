import express from "express";
import {
	registr,
	login,
	auth,
	getProfileInfo,
} from "../controllers/user-controller.js";
import {
	registrValidation,
	loginValidation,
} from "../validations/user-validation.js";

const userRouter = express.Router();

// Регистрация с предварительной валидацией данных запроса
userRouter.post("/registr", registrValidation, registr);
// Логин
userRouter.get("/login", loginValidation, login);
// Запрос данных авторизированного пользователя
userRouter.get("/profile", auth, getProfileInfo);
// Аутентификация
userRouter.get("/auth", auth);

export default userRouter;
