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

		// Валидирование данных при помощи express-validator
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				status: "failed",
				message: "Неправильно введены данные",
				errors: errors.array(),
			});
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

		// Проверяем их на валидность
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				status: "failed",
				message: "Неправильно введены данные",
				errors: errors.array(),
			});
		}

		// Поиск по email из бд
		const user = await userModel.findOne({ email });

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

// Аутентификация
export const auth = async (req, res) => {
	try {
		// Проверить наличие ключа авторизации в заголовках запроса
		if (!req.headers.authorization) {
			res.status(400).json({
				status: "failed",
				message: "Ошибка аутентификации. Отсутствует заголовок авторизации",
			});
		}
		// Вычленить сам JWT из "Bearer eyJh..."
		const bearerToken = await req.headers.authorization.split(" ")[1];
		// Попытка расшифровать JWT токен и попробовать вытащить _id (user._id)
		let idFromToken;
		try {
			idFromToken = await jwt.decode(bearerToken)._id;
		} catch (err) {
			// Расшифровка/получение _id не удалось - ответ с ошибкой
			res.status(400).json({
				status: "failed",
				message: "Ошибка аутентификации. Некорректный ключ авторизации",
			});
		}
		// Попытки найти пользователя в БД по _id
		const user = await userModel.findById({ idFromToken });
		if (!user) {
			res.status(400).json({
				status: "failed",
				message: "Ошибка аутентификации. Не удалось найти пользователя",
			});
		}
		// Пользователь найден - значит отправить нечувствительные данные о нём, а также - сгенерированный токен
		const { passwordHash, ...userInfo } = user._doc;
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
			message: "Аутентификация прошла успешно!",
		});
	} catch (err) {
		res.status(400).json({
			status: "failed",
			message: "Ошибка. Не удалось аутентифицировать пользователя",
		});
	}
};
