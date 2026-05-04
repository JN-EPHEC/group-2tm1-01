import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Product extends Model {}

Product.init(
  {
    id_prod: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nb: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    id_tva: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tvas",
        key: "id_tva",
      },
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: false,
  },
);

export default Product;
