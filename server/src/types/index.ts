import User from "./User.js";
import TVA from "./TVA.js";
import Product from "./Product.js";
import Transaction from "./Transaction.js";
import Expense from "./Depense.js";
import TransactionProduct from "./TransactionProduct.js";

// Associations
User.hasMany(Transaction, {
  foreignKey: "id",
  as: "transactions",
});
Transaction.belongsTo(User, {
  foreignKey: "id",
  as: "user",
});

User.hasMany(Expense, {
  foreignKey: "id",
  as: "expenses",
});
Expense.belongsTo(User, {
  foreignKey: "id",
  as: "user",
});

TVA.hasMany(Product, {
  foreignKey: "id_tva",
  as: "products",
});
Product.belongsTo(TVA, {
  foreignKey: "id_tva",
  as: "tva",
});

Transaction.belongsToMany(Product, {
  through: TransactionProduct,
  foreignKey: "id_transaction",
  otherKey: "id_prod",
  as: "products",
});
Product.belongsToMany(Transaction, {
  through: TransactionProduct,
  foreignKey: "id_prod",
  otherKey: "id_transaction",
  as: "transactions",
});

export { User, TVA, Product, Transaction, Expense, TransactionProduct };
