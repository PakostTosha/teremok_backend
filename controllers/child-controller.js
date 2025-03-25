import childModel from "../models/child-model.js";
import userModel from "../models/user-model.js";
import mongoose from "mongoose";

// Регистрация нового ребёнка
export const addChild = async (req, res) => {
	try {
		// Объект нового ребёнка
		const newChild = new childModel({
			parentId: req.userId,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			patronymic: req.body.patronymic || "",
			statistic: req.body.statistic,
		});

		// Создать запись о ребёнке в БД
		const saveChildResult = await newChild.save();
		// Указать ID созданного ребёнка в записи его родителя
		const parentId = req.userId;
		const childId = saveChildResult._id;
		const bindindChildToParent = await userModel.updateOne(
			{ _id: parentId },
			{ $push: { childrens: childId } }
		);

		res.json({ saveChildResult, bindindChildToParent });
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Не удалось зарегистрировать ребёнка",
		});
	}
};

// Изменить информацию о ребёнке
export const changeChildInfo = async (req, res) => {
	try {
		// Вытаскиваем обновлённые данные из запроса
		const updatedChild = {
			firstName: req.body.firstName, // firstName
			lastName: req.body.lastName, // lastName
			patronymic: req.body.patronymic || "", // patronymic
		};

		// Вытаскиваем ID РЕБЁНКА
		const childId = req.body.childId;

		// Обновляем запись пользователя. В качестве "фильтра" для обновления передаём id ребёнка
		const updateResult = await childModel.updateOne(
			{ _id: childId },
			{ $set: updatedChild }
		);

		// Результат обновления
		console.log(updateResult);

		if (updateResult.modifiedCount > 0) {
			res.json({
				success: true,
				message: "Данные ребёнка успешно обновлены",
				updateResult,
			});
		} else {
			res.status(400).json({
				success: false,
				message: "Не удалось обновить данные ребёнка",
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Не удалось обновить информацию о ребёнке",
		});
	}
};

// Удалить запись о ребёнке
export const deleteChild = async (req, res) => {
	try {
		const childId = req.params.id;
		const parentId = req.params.parent;

		const deleteResultChild = await childModel.findByIdAndDelete(childId);

		if (!deleteResultChild) {
			throw new Error("Ребёнок не найден");
		}

		const deleteResultFromParent = await userModel.findByIdAndUpdate(
			parentId,
			{
				$pull: { childrens: childId },
			},
			{ new: true }
		);

		if (!deleteResultFromParent) {
			throw new Error("Родитель не найден");
		}

		res.json({
			success: true,
			message: "Запись о ребёнке успешно удалена",
		});
		// else {
		// 	res.status(400).json({
		// 		success: false,
		// 		message: "Во время удаления записи о ребёнке возник сбой",
		// 	});
		// }
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Не удалось удалить запись о ребёнке",
		});
	}
};
