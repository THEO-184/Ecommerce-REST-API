require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connect");
const notFoundMiddleWare = require("./middleware/not-found");
const errorHandleMiddleware = require("./middleware/error-handler");
const productsRouter = require("./routes/products");

const app = express();

// middleware
app.use("/api/v1/products", productsRouter);
app.use(express.json());
app.use(notFoundMiddleWare, errorHandleMiddleware);

app.get("/", (req, res) => {
	res.send(
		"<h1>Store Products</h1><a href='/api/v1/products'>Go to Products</a>"
	);
});

const port = process.env.PORT || 3000;

const start = async () => {
	await connectDB(process.env.DB_URL);
	app.listen(port, () => {
		console.log(`server running on port ${port}`);
	});
};

start();
