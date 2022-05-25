console.clear();
const Products = require("../models/product");

// get all products
const getAllProductsStatic = async (req, res) => {
	const products = await Products.find({}).sort("name").select("name price");

	res.status(200).json({ success: true, total: products.length, products });
};

// implement queries and sortings
const getAllProducts = async (req, res) => {
	const { name, price, featured, company, sort, fields, numericFilter } =
		req.query;
	const queryObj = {};
	if (featured) {
		queryObj.featured = featured;
	}
	if (name) {
		queryObj.name = { $regex: name, $options: "i" };
	}
	if (company) {
		queryObj.company = company;
	}

	if (numericFilter) {
		const numericOperators = {
			">": "$gt",
			">=": "$gte",
			"=": "$eq",
			"<=": "$lte",
			"<": "$lte",
		};
		const regEx = /\b(<|>|>=|=|<|<=)\b/g;
		let filters = numericFilter.replace(
			regEx,
			(match) => `-${numericOperators[match]}-`
		);
		const options = ["price", "rating"];
		filters.split(",").forEach((item) => {
			const [field, operator, value] = item.split("-");
			if (options.includes(field)) {
				queryObj[field] = { [operator]: Number(value) };
			}
		});
	}

	// sort
	let results = Products.find(queryObj);
	if (sort) {
		let sortedList = sort.split(",").join(" ");
		results = results.sort(sortedList);
	}
	// select fields
	if (fields) {
		const fieldsList = fields.split(",").join(" ");
		results = results.select(fieldsList);
		console.log(fieldsList);
	}

	console.log(queryObj);
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	// results = results.skip(skip).limit(limit);

	const sortedProducts = await results;

	res
		.status(200)
		.json({ success: true, total: sortedProducts.length, sortedProducts });
};

module.exports = {
	getAllProducts,
	getAllProductsStatic,
};
