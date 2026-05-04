"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Products",
      [
        {
          name: "Tape Neuromusculaire (Rouleau)",
          price_htva: 12.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Crème de massage chauffante 500ml",
          price_htva: 24.99,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Élastique de résistance (Moyen)",
          price_htva: 8.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
