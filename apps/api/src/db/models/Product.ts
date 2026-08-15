import mongoose, { Schema, Document, Model } from "mongoose";
import type { CategorySlug, SizePriceOption } from "@pizzaconstructor/shared";

export interface IProductDocument extends Document {
  name: string;
  category: CategorySlug;
  description?: string;
  image?: string;
  ingredients: { name: string }[];
  allergens: { name: string }[];
  sizePrices: SizePriceOption[];
  isAvailable: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SizePriceSchema = new Schema<SizePriceOption>(
  {
    size: { type: String, required: true },
    price: { type: Number, required: true },
    weightG: { type: Number },
  },
  { _id: false }
);

const IngredientItemSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { _id: false }
);

const AllergenItemSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ["pizza", "salad", "desert", "beverages", "vegan"],
      index: true,
    },
    description: { type: String, trim: true },
    image: { type: String, default: "/img/pizza_medium.png" },
    ingredients: [IngredientItemSchema],
    allergens: [AllergenItemSchema],
    sizePrices: { type: [SizePriceSchema], default: [] },
    isAvailable: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const ProductModel: Model<IProductDocument> =
  mongoose.models.Product ||
  mongoose.model<IProductDocument>("Product", ProductSchema);
