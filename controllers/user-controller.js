import userModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

// Секретный/приватный ключ для генерации JWT-токена
const secretJwtKey = "Teremok_BE";

// Регистрация
export const registr = async (req, res) => {
	try {
		// Вытаскиваем данные из дела запроса
		const { email, password, firstName, lastName, patronymic, avatarUrl } =
			req.body;

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
			user: { ...userInfo },
			tokenJWT,
			status: "completed",
			message: "Регистрация прошла успешно!",
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({
			status: "failed",
			message: "Не удалось зарегистрировать пользователя",
		});
	}
};

// Авторизация
export const login = async (req, res) => {
	try {
		// Получаем введённые данные
		const { email, password } = req.body;

		// Поиск по email из бд
		const user = await userModel.findOne({ email }).populate("childrens");

		// Если пользователь не найден - завершить процесс авторизации
		if (!user) {
			return res.status(400).json({
				status: "failed",
				message: "Неверный логин или пароль. Проверьте введённые данные",
			});
		}

		// Проверить хэш введённого пароля с хэшем пароля из документа найденного пользователя
		const checkPassword = await bcrypt.compare(password, user.passwordHash);
		if (!checkPassword) {
			return res.status(400).json({
				status: "failed",
				message: "Неверный логин или пароль. Проверьте введённые данные",
			});
		}

		// Логин и пароль корректны
		const { passwordHash, ...userInfo } = user._doc;
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
		return res.json({
			user: { ...userInfo },
			tokenJWT,
			status: "success",
			message: "Авторизация прошла успешно!",
		});
	} catch (err) {
		console.log(err);
		res
			.status(400)
			.json({ status: "failed", message: "Не удалось авторизоваться" });
	}
};

// Аутентификация (проверка токена)
export const auth = async (req, res, next) => {
	// Из запроса вычленяем Bearer токен
	const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
	if (token) {
		// Если токен найден, декодировать id, добавить его в запрос и перейти к выполнению следующей функции
		try {
			const decoded = jwt.verify(token, secretJwtKey);
			req.userId = decoded._id;
			next();
		} catch (e) {
			return res.status(403).json({ status: "failed", message: "Нет доступа" });
		}
	} else {
		return res
			.status(403)
			.json({ status: "failed", message: "Доступ отсутствует" });
	}
};

// Получение данных пользователя
export const getProfileInfo = async (req, res) => {
	// Перед вызовом данной функции необходимо вызвать функцию "auth" для получения id в параметрах запроса
	const user = await userModel.findById(req.userId).populate("childrens");

	if (!user) {
		return res.status(400).json({
			status: "failed",
			message: "Пользователь не найден",
		});
	}

	const { passwordHash, ...profileInfo } = user._doc;
	res.json({
		user: profileInfo,
		status: "success",
		message: "Данные пользователя получены успешно!",
	});
};

// Сохранение измененных данных авторизованного пользователя
export const changeProfileInfo = async (req, res) => {
	try {
		// Вытаскиваем обновлённые данные из запроса
		const updatedUser = {
			firstName: req.body.firstName, // firstName
			lastName: req.body.lastName, // lastName
			patronymic: req.body.patronymic, // patronymic
			avatarUrl: req.body.avatarUrl, // avatarUrl
			telephone: req.body.telephone, //telephone
		};

		// Вытаскиваем ID пользователя из запроса после выполнения middleware "auth"
		const userId = req.userId;
		// Обновляем запись пользователя. В качестве "фильтра" для обновления передаём ID
		const updateResult = await userModel.updateOne(
			{ _id: userId },
			{ $set: updatedUser }
		);

		// Результат обновления
		console.log(updateResult);

		if (updateResult.modifiedCount > 0) {
			res.json({
				success: true,
				message: "Ваши данные успешно обновлены",
				updateResult,
			});
		} else {
			res.status(400).json({
				success: false,
				message: "Не удалось обновить данные пользователя",
			});
		}
	} catch (error) {
		console.error("Ошибка при обновлении данных пользователя", error);
		return res.status(400).json({
			status: "failed",
			message: "Не удалось обновить данные пользователя",
		});
	}
};
