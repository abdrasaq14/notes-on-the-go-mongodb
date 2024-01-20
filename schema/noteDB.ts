import mongoose, { Document } from "mongoose";
export interface notesInterface extends Document {
  title: string;
  description: string;
  status: string;
  author: mongoose.Schema.Types.ObjectId;
}
export interface userInterface extends Document {
  fullname: string;
  email: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken: string;
  };
  phone_no: string;
}
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },

  phone_no: { type: String },
});

const notesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  due_date: { type: String, required: true },
  status: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
});

const restaurantSchema = new mongoose.Schema(
  {
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
  }
  // { collection: "restaurant" }
); //this is the name of the collection in the database
export const UserModel = mongoose.model("UserModel", userSchema);
export const NotesModel = mongoose.model("NotesModel", notesSchema);
export const RestaurantModel = mongoose.model(
  "RestaurantsModel",
  restaurantSchema
);

// user methods
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById({ _id: id });
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((userResponse) => userResponse.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findByIdAndDelete({ _id: id });

export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);

//notes methods
export const getNotes = () => NotesModel.find();
export const getNotesById = (userId: string) =>
  NotesModel.find({ author: userId });
export const getNotesByAuthorId = (userId: string) =>
  NotesModel.find({ author: userId });
export const createNote = (values: Record<string, any>) => {
  new NotesModel(values)
    .save()
    .then((notesResponse) => notesResponse.toObject());
};
export const deleteNotesById = (id: string) =>
  NotesModel.findByIdAndDelete({ _id: id });

export const updateNotesById = async (
  id: string,
  values: Record<string, any>
) => {
  try {
    const updatedNotes = await NotesModel.findByIdAndUpdate(id, values, {
      new: true,
    });
    return updatedNotes;
  } catch (error) {
    console.error("Error updating notes:", error);
    throw error; // Rethrow the error to be caught by the calling code if needed
  }
};

// user methods
export const getRestaurantByName = (value: string) =>
  RestaurantModel.find({ name: value });
