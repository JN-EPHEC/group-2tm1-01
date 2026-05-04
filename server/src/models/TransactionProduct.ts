import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class TransactionProduct extends Model {}

TransactionProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_transaction: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "transactions",
        key: "id_transaction",
      },
    },
    id_prod: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id_prod",
      },
    },
    mode_paiement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TransactionProduct",
    tableName: "transaction_products",
    timestamps: false,
  },
);

export default TransactionProduct;
