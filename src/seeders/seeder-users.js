'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@example.com',
      password:'123456',
      firstName: 'hoidanit',
      lastName: 'hoidanit',
      address: 'hoidanit',
      gender: 1,
      roleid: 'hoidanit',
      image: 'hoidanit',
      typeRole: 'R1',
      keyRole: 'hoidanit',
      
      lastName: 'eric',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
