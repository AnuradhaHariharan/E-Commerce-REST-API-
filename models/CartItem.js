module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define("CartItem", {
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      priceAtAddition: {
        type: DataTypes.FLOAT,
      },
    });
  
    return CartItem;
  };
  