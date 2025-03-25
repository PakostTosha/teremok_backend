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
	updateProfileValidation,
} from "../validations/user-validation.js";
import handleValidationErrors from "../utils/handleValidationErrors.js";
import { childInfoValidation } from "../validations/child-validation.js";
import {
	addChild,
	changeChildInfo,
	deleteChild,
} from "../controllers/child-controller.js";

const userRouter = express.Router();

// Регистрация с предварительной валидацией данных запроса
userRouter.post("/registr", registrValidation, handleValidationErrors, registr);
// Логин
userRouter.post("/login", loginValidation, handleValidationErrors, login);
// Аутентификация
userRouter.get("/auth", auth);
// Запрос данных авторизированного пользователя
userRouter.get("/profile", auth, getProfileInfo);
// Сохранение измененных данных авторизованного пользователя
userRouter.patch(
	"/changeProfile",
	auth,
	updateProfileValidation,
	handleValidationErrors,
	changeProfileInfo
);

// Создание записи о ребёнке
userRouter.post(
	"/addChild",
	auth,
	childInfoValidation,
	handleValidationErrors,
	addChild
);
// Изменение записи о ребёнке
userRouter.patch(
	"/changeChildInfo",
	auth,
	childInfoValidation,
	handleValidationErrors,
	changeChildInfo
);
// Удаление записи о ребёнке
userRouter.delete("/deleteChild/:id/:parent", auth, deleteChild);

export default userRouter;
