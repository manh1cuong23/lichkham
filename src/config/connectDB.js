const { Sequelize } = require('sequelize');


// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('d3j4qbjm62n0h6', ' kxchmornblhzpt', '1bc08e2ed8e8dbd520048a336ed49d1cf19579f76cc3c6d7602a9d1c060d0e8c', {
  host: 'ec2-34-227-120-79.compute-1.amazonaws.com',
  dialect:  'postgres',
  "logging": false,
  "dialectOptions":{
    "ssl":{
      "require":true,
      "rejectUnauthorized":false
    }
  }
});
let connectDB = async()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
module.exports = connectDB;