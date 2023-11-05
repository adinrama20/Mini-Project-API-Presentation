module.exports = (sequelize, DataTypes) => {
  const Borrow = sequelize.define(
    "Borrow",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      idCart: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tglPinjam: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      tglKembali: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "borrowing",
    }
  );

  return Borrow;
};
