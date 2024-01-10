"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRestaurantByName = exports.updateNotesById = exports.deleteNotesById = exports.createNote = exports.getNotesByAuthorId = exports.getNotesById = exports.getNotes = exports.updateUserById = exports.deleteUserById = exports.createUser = exports.getUserById = exports.getUserBySessionToken = exports.getUserByEmail = exports.getUsers = exports.RestaurantModel = exports.NotesModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    },
    address: { type: String, unique: true },
    phone_no: { type: String },
    gender: { type: String },
});
const notesSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    due_date: { type: String, required: true },
    status: { type: String, required: true },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "UserModel",
    },
});
const restaurantSchema = new mongoose_1.default.Schema({
    address: {
        building: String,
        coord: [Number],
        street: String,
        zipcode: String,
    },
    borough: String,
    cuisine: String,
    grades: [
        {
            date: Date,
            grade: String,
            score: Number,
        },
    ],
    name: String,
    restaurant_id: String,
}); //this is the name of the collection in the database
exports.UserModel = mongoose_1.default.model("UserModel", userSchema);
exports.NotesModel = mongoose_1.default.model("NotesModel", notesSchema);
exports.RestaurantModel = mongoose_1.default.model("RestaurantsModel", restaurantSchema);
// user methods
const getUsers = () => exports.UserModel.find();
exports.getUsers = getUsers;
const getUserByEmail = (email) => exports.UserModel.findOne({ email });
exports.getUserByEmail = getUserByEmail;
const getUserBySessionToken = (sessionToken) => exports.UserModel.findOne({ "authentication.sessionToken": sessionToken });
exports.getUserBySessionToken = getUserBySessionToken;
const getUserById = (id) => exports.UserModel.findById({ _id: id });
exports.getUserById = getUserById;
const createUser = (values) => new exports.UserModel(values).save().then((userResponse) => userResponse.toObject());
exports.createUser = createUser;
const deleteUserById = (id) => exports.UserModel.findByIdAndDelete({ _id: id });
exports.deleteUserById = deleteUserById;
const updateUserById = (id, values) => exports.UserModel.findByIdAndUpdate(id, values);
exports.updateUserById = updateUserById;
//notes methods
const getNotes = () => exports.NotesModel.find();
exports.getNotes = getNotes;
const getNotesById = (userId) => exports.NotesModel.find({ author: userId });
exports.getNotesById = getNotesById;
const getNotesByAuthorId = (userId) => exports.NotesModel.find({ author: userId });
exports.getNotesByAuthorId = getNotesByAuthorId;
const createNote = (values) => {
    new exports.NotesModel(values)
        .save()
        .then((notesResponse) => notesResponse.toObject());
};
exports.createNote = createNote;
const deleteNotesById = (id) => exports.NotesModel.findByIdAndDelete({ _id: id });
exports.deleteNotesById = deleteNotesById;
const updateNotesById = (id, values) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedNotes = yield exports.NotesModel.findByIdAndUpdate(id, values, {
            new: true,
        });
        return updatedNotes;
    }
    catch (error) {
        console.error("Error updating notes:", error);
        throw error; // Rethrow the error to be caught by the calling code if needed
    }
});
exports.updateNotesById = updateNotesById;
// user methods
const getRestaurantByName = (value) => exports.RestaurantModel.find({ name: value });
exports.getRestaurantByName = getRestaurantByName;
