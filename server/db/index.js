import mongoose from "mongoose";

const login = "polyakovaa03";
const password = "Chubrikazimov2003";
const dbName = "teremok";

mongoose
	.connect(
		`mongodb+srv://${login}:${password}!@cluster0.gyqlk.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`
	)
	.then(() => console.log("Connection to mongodb/teremok: success"))
	.catch((err) => console.log("DB error,", err));

const db = mongoose.connection;

export default db;
