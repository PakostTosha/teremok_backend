import { body } from "express-validator";

// Валидация данных регистрации
export const registrValidation = [
	// Валидация данных из тела запроса
	// email, password, firstName, lastName, patronymic, avatarUrl
	body("email", "Неверный формат почты").isEmail(),
	body("password", "Передайте строку больше 5 и меньше 50 символов")
		.isString()
		.isLength({ min: 6, max: 50 }),
	body("firstName", "Передайте строку от 2 до 50 символов")
		.isString()
		.isLength({ min: 2, max: 50 }),
	body("lastName", "Передайте строку от 2 до 50 символов")
		.isString()
		.isLength({ min: 2, max: 50 }),
	body("patronymic", "Передайте строку от 2 до 50 символов")
		.isString()
		.isLength({ min: 2, max: 50 })
		.optional(),
	body("avatarUrl").isString().optional(),
];

// Валидация данных авторизации
