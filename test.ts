import { Schema } from "mongoose";
import { number, string } from "zod";

const ownerSchema = new Schema({
  fullname: {
    type: string,
    required: true,
  },
  email: {
    type: string,
    required: true,
    },
    password: {
      type: string,
      required: true,
    },

});
const productSchema = new Schema({
  title: {
    type: string,
    required: true,
  },
  category: {
    type: string,
    required: true,
    },
    imageUrl: {
      type: string,
      required: true,
    },
    price: {
        type: number,
        required: true,
    },
    owner: [ownerSchema]

});
