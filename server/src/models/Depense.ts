import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Depense extends Model {}

Depense.init(
  {
    id_depense: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ts: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prix_depense: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
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
    modelName: "Depense",
    tableName: "Depenses",
    timestamps: false,
  },
);

export default Depense;
