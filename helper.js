

function emailVerify(email, database) {
  for (userId in database) {
    if (email === database[userId].email) {
      return database[userId];
    }
  }
  return false
};

module.exports = { emailVerify };