import { validationResult } from "express-validator";

export default (req, res, next) => {
	// Проверяем их на валидность
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			status: "failed",
			message: "Неправильно введены данные",
			errors: errors.array(),
		});
	}
	next();
};
