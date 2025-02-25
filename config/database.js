require('dotenv').config(); // 載入 dotenv 套件
const { Sequelize } = require('sequelize');

// 使用sequelize即為ORM方式查詢，可以不用自己打sql的語法
const sequelize = new Sequelize(
    process.env.DB_NAME,       
    process.env.DB_USER,       
    process.env.DB_PASSWORD,   
    {
        host: process.env.DB_HOST,  // 資料庫位址
        port: process.env.DB_PORT,  // 連接埠（MariaDB 預設 3306）
        dialect: 'mariadb',         
        logging: false              // 設定為 `true` 會顯示 SQL 查詢日誌
    }
);

console.log('資料庫主機:', process.env.DB_HOST);
console.log('資料庫使用者:', process.env.DB_USER);
console.log('資料庫名稱:', process.env.DB_NAME);


sequelize.authenticate()
    .then(() => console.log('✅ MariaDB 連線成功'))
    .catch(err => console.log('❌ 連線失敗',err))


module.exports = sequelize;