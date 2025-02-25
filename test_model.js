const User = require('./models/userModel');

const sequelize = require('./config/database');

(async () => {
    await sequelize.sync({ alter: true }) // ✅ Sync database
        .then(() => console.log('✅ Database synchronized'))
        .catch(err => console.error('❌ Sync failed:', err));
})();