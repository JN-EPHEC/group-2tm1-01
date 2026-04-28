import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class TVA extends Model {}

TVA.init(
  {
    id_tva: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tb: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valeur_taux: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TVA",
    tableName: "tvas",
    timestamps: false,
  },
);

export default TVA;
