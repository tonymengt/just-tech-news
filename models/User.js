const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

// create our User model
class User extends Model {}

// define table columns and confirguration
User.init(
    {
        // table column definition go here
        id:{
            // use the special Sequelize DataTypes object provided wha type of data it is
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at leadt four characters long
                len: [4]
            }
        }
    },
    {
        // table configuration optiones go here (https://sequelize.org/v5/manual/models-definition.html#configuration)

        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't plurlize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text' and not 'commentText')
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;