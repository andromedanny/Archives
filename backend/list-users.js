const { sequelize } = require('./config/database');
require('./models');
const User = require('./models/User');
(async () => {
  try {
    await sequelize.authenticate();
    const users = await User.findAll({ attributes: ['id','email','student_id','role'] });
    console.log(users.map(u => u.toJSON()));
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
})();
