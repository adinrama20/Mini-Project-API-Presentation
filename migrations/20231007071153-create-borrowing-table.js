"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("borrowing", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      idCart: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "carts",
          },
          key: "id",
        },
      },
      tglPinjam: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      tglKembali: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("borrowing");
  },
};
