"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noteDB_1 = require("../../schema/noteDB");
const searchTerm = "Reg";
noteDB_1.RestaurantModel.find({
    name: {
        $regex: new RegExp(searchTerm, "i"),
    },
}, {
    restaurant_id: 1,
    name: 1,
    borough: 1,
    cuisine: 1,
    _id: 0,
})
    .then((result) => {
    console.log("Matching restaurants:", result);
})
    .catch((err) => {
    console.error("Error querying restaurants:", err);
});
