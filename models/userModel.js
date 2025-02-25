
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    game_played:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    win_count:{
        type:DataTypes.INTEGER,
        defaultValue:0
    }
},{
    tableName:'users',
    timestamps:false
});

module.exports = User;
