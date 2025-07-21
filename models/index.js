const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require("./User")(sequelize, Sequelize);
db.Category = require("./Category")(sequelize, Sequelize);
db.Product = require("./Product")(sequelize, Sequelize);
db.Cart = require("./Cart")(sequelize, Sequelize);
db.CartItem = require("./CartItem")(sequelize, Sequelize);
db.Order = require("./Order")(sequelize, Sequelize);
db.OrderItem = require("./OrderItem")(sequelize, Sequelize);

// Define relationships
db.Category.hasMany(db.Product);
db.Product.belongsTo(db.Category);

db.User.hasOne(db.Cart);
db.Cart.belongsTo(db.User);

db.Cart.belongsToMany(db.Product, { through: db.CartItem });
db.Product.belongsToMany(db.Cart, { through: db.CartItem });

db.User.hasMany(db.Order);
db.Order.belongsTo(db.User);

db.Order.belongsToMany(db.Product, { through: db.OrderItem });
db.Product.belongsToMany(db.Order, { through: db.OrderItem });

module.exports = db;
