import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChildSchema = new Schema(
	{
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
			required: [true, "lastName is required"],
			min: [2, "lastName must contain more than 2 characters"],
			max: [50, "lastName must contain less than 50 characters"],
		},
		// Отчество
		patronymic: {
			type: String,
			required: [true, "patronymic is required"],
			min: [2, "patronymic must contain more than 2 characters"],
			max: [50, "patronymic must contain less than 50 characters"],
		},
	},
	// Автообновляющиеся параметры
	{
		timestamps: true,
	}
);

export default mongoose.model("Child", ChildSchema);
