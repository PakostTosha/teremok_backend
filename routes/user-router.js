import express from "express";
import {
	registr,
	login,
	auth,
	getProfileInfo,
	changeProfileInfo,
} from "../controllers/user-controller.js";
import {
	registrValidation,
	loginValidation,
} from "../validations/user-validation.js";

const userRouter = express.Router();

// Регистрация с предварительной валидацией данных запроса
userRouter.post("/registr", registrValidation, registr);
// Логин
userRouter.post("/login", loginValidation, login);
// Аутентификация
userRouter.get("/auth", auth);
// Запрос данных авторизированного пользователя
userRouter.get("/profile", auth, getProfileInfo);
// Сохранение измененных данных авторизованного пользователя
userRouter.post("/changeProfile", auth, changeProfileInfo);

// Создание записи о ребёнке
// Удаление записи о ребёнке
// Изменение записи о ребёнке

export default userRouter;
