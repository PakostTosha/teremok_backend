import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChildSchema = new Schema(
	{
		// Родитель
		parentId: {
			type: mongoose.Schema.ObjectId,
			ref: "Users",
			require: true,
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
			required: [true, "lastName is required"],
			min: [2, "lastName must contain more than 2 characters"],
			max: [50, "lastName must contain less than 50 characters"],
		},
		// Отчество
		patronymic: {
			type: String,
			require: false,
			min: [2, "patronymic must contain more than 2 characters"],
			max: [50, "patronymic must contain less than 50 characters"],
		},
		// Статистика (возможно пригодится)
		statistic: {
			type: Object,
			// Общее количество собранных карточек (1 карточка = 1 выполненное задание)

			// Структура:
			// cards {
			// 	count: 2,
			// 	types: [
			// 		{
			// 			id: 0,
			// 			collected: 2
			// 		},
			// 		{
			// 			id: 1,
			// 			collected: 2
			// 		},
			// 		{
			// 			id: 2,
			// 			collected: 2
			// 		},
			// 		{
			// 			id: 3,
			// 			collected: 2
			// 		},
			// 		{
			// 			id: 4,
			// 			collected: 2
			// 		},
			// 	]
			// }

			cards: {
				count: {
					type: Number,
				},
				// Типы собранных карточек
				// [0 0 0 0 0] - начальное значения
				// types[i] += 1 (прибавить карточку i-ого типа)
				types: {
					type: Array,
				},
			},
		},
	},
	// Автообновляющиеся параметры
	{
		timestamps: true,
	}
);

export default mongoose.model("Child", ChildSchema);
