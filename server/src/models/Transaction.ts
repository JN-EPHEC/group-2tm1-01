import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Transaction extends Model {}

Transaction.init(
  {
    id_transaction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    heure: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Transaction",
    tableName: "transactions",
    timestamps: false,
  },
);

export default Transaction;
