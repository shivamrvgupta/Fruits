const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema({
    name: { 
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);
module.exports = Fruit;

