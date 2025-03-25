import { body } from "express-validator";
import userModel from "../models/user-model.js";

// Валидация данных регистрации
export const registrValidation = [
	// Валидация данных из тела запроса
	// email, password, firstName, lastName, patronymic, avatarUrl
	body("email", "Неверный формат почты")
		.isEmail()
		.custom(async (value) => {
			const user = await userModel.findOne({ email: value });
			if (user) {
				return await Promise.reject("Введите другую почту");
			}
		}),
	body("password", "Передайте строку больше 4 и меньше 50 символов")
		.isString()
		.isLength({ min: 5, max: 50 }),
	body("firstName", "Передайте строку от 2 до 50 символов")
		.isString()
		.isLength({ min: 2, max: 50 }),
	body("lastName", "Передайте строку от 2 до 50 символов")
		.isString()
		.isLength({ min: 2, max: 50 }),
	body("patronymic", "Передайте строку от 2 до 50 символов")
		.isString()
		.isLength({ min: 2, max: 50 })
		.optional({ nullable: true, checkFalsy: true }),
	body("avatarUrl").isString().optional(),
];

// Валидация данных авторизации
export const loginValidation = [
	// email, password
	body("email", "Неверный формат почты").isEmail(),
	body("password", "Передайте строку больше 5 и меньше 50 символов")
		.isString()
		.isLength({ min: 5, max: 50 }),
];

// Валидация обновлённых данных
export const updateProfileValidation = [
	// Валидация данных из тела запроса
	// email, password, firstName, lastName, patronymic, avatarUrl
	body("firstName", "Передайте строку от 2 до 50 символов")
		.isString()
		.isLength({ min: 2, max: 50 }),
	body("lastName", "Передайте строку от 2 до 50 символов")
		.isString()
		.isLength({ min: 2, max: 50 }),
	body("patronymic", "Передайте строку от 2 до 50 символов")
		.isString()
		.isLength({ min: 2, max: 50 })
		.optional({ nullable: true, checkFalsy: true }),
	body("telephone")
		.optional({ nullable: true, checkFalsy: true })
		.isMobilePhone("ru-RU"),
	body("avatarUrl").isString().optional(),
	body("childrens").optional(),
];
