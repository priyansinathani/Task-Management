const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/service-portal')
  .then(async () => {
    try {
      const res = await User.updateMany({ role: 'user' }, { $set: { role: 'Client' } });
      console.log('Updated ' + res.modifiedCount + ' users from user to Client');
    } catch (err) {
      console.error(err);
    }
    process.exit(0);
  });
