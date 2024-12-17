import userModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

// Регистрация
export const registr = async (req, res) => {
	try {
		// Вытаскиваем данные из дела запроса
		const { email, password, firstName, lastName, patronymic, avatarUrl } =
			req.body;

		// Валидирование данных при помощи express-validator
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		// Хэширование пароля
		const salt = await bcrypt.genSalt(10);
		const pswrdHash = await bcrypt.hash(password, salt);

		// Создание документа пользователя
		const newUserDoc = new userModel({
			email,
			passwordHash: pswrdHash,
			firstName,
			lastName,
			patronymic,
			avatarUrl,
		});

		// Попытка сохранить пользователя в mongodb (асинхронное действие)
		const user = await newUserDoc.save();

		// Секретный/приватный ключ для генерации JWT-токена
		const secretJwtKey = "Teremok_BE";
		// Генерация JWT-токена с id пользователя в БД
		const tokenJWT = jwt.sign(
			{
				_id: user._id,
			},
			secretJwtKey,
			{
				expiresIn: "3d",
			}
		);

		// Ответ успешной регистрации
		const { passwordHash, ...userInfo } = user._doc;
		res.json({
			...userInfo,
			tokenJWT,
			status: "completed",
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({
			message: "Не удалось зарегистрировать пользователя",
		});
	}
};

// Авторизация
// export const login =

// Аутентификация
// export const auth
