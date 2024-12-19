import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		// Почта
		email: {
			type: String,
			required: [true, "email is required"],
			unique: true,
		},
		// Хэшированный пароль
		passwordHash: {
			type: String,
			required: [true, "password is required"],
		},
		// Имя
		firstName: {
			type: String,
			required: [true, "firstName is required"],
			min: [2, "firstName must contain more than 2 characters"],
			max: [50, "firstName must contain less than 50 characters"],
		},
		// Фамилия
		lastName: {
			type: String,
			required: true,
			min: [2, "lastName must contain more than 2 characters"],
			max: [50, "lastName must contain less than 50 characters"],
		},
		// Отчество (опицонально)
		patronymic: {
			type: String,
			min: [2, "patronymic must contain more than 2 characters"],
			max: [50, "patronymic must contain less than 50 characters"],
		},
		// Аватарка (опционально)
		avatarUrl: {
			type: String,
		},
	},
	// Автообновляющиеся параметры
	{
		timestamps: true,
	}
);

export default mongoose.model("Users", UserSchema);
