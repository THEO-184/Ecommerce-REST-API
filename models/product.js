const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ProductsSchema = new Schema({
	name: {
		type: String,
		required: [true, "product name must be provided"],
	},
	price: {
		type: Number,
		required: [true, "product price must be provided"],
	},
	featured: {
		type: Boolean,
		default: false,
	},
	rating: {
		type: Number,
		default: 4.5,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	company: {
		type: String,
		enum: {
			values: ["marcos", "liddy", "ikea", "caressa"],
			message: "{VALUE} is not supported",
		},
	},
});

module.exports = model("Product", ProductsSchema);
