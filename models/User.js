const { Model, Datatypes, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//Create User model
class User extends Model {}

//define table columns and configuration
User.init(
     {
          //Table column definitions go here
          id: {
               //Use sequelize DataTypes object to provide what kind of data
               type: DataTypes.INTEGER,
               //This is mySQL's NOT NULL function
               allowNull: false,
               //This is primary key
               primaryKey: true,
               //turn on auto increment
               autoIncrement: true
          },
          //define username
          username: {
               type: DataTypes.STRING,
               allowNull: false
          },
          //define email column
          email: {
               type: DataTypes.STRING,
               allowNull: false,
               //No dupe values allowed in table
               unique: true,
               // if allowNull is set to false, we can run data through validator
               validate: {
                    isEmail: true
               }
          },
          //define password column
          password: {
               type: DataTypes.STRING,
               allowNull: false,
               validate: {
                    //pass must be at least 4 characters long
                    len: [4]
               }
          }
     },
     {
          hooks: {
               //set up beforeCreate lifecycle hook functionality
               async beforeCreate(newUserData) {
                    newUserData.password = await bcrypt.hash(newUserData.password, 10);
                    return newUserData;
               },

               //set up beforeUpdate lifecycle hook functionality
               async beforeUpdate(updatedUserData) {
                    updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                    return updatedUserData;
               }
          },
          //Table config options go here
          //pass in imported sequelize connection
          sequelize,
          //don't automatically create created/updatedAt timestamp fields
          timestamps: false,
          //don't pluralize name of database table
          freezeTableName: true,
          //use underscores instead of camel case
          underscored: true,
          //model name stays lowercase in database
          modelName: 'user'
     }
);

module.exports = User;