import { body } from "express-validator";

// Валидация данных ребёнка
export const childInfoValidation = [
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
];
