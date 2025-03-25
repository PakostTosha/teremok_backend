import mongoose from "mongoose";

mongoose
	.connect(process.env.connect)
	.then(() => console.log("Connection to mongodb/teremok: success"))
	.catch((err) => console.log("DB error,", err));

const db = mongoose.connection;

export default db;
