

// // email verification
// function emailVerify(email) {
//   for (userId in users) {
//     if (email === users[userId].email) {
//       return users[userId];
//     }
//   }
//   return false
// };

// // email verification - refactored
function emailVerify(email, database) {
  for (userId in database) {
    if (email === database[userId].email) {
      return database[userId];
    }
  }
  return false
};

module.exports = { emailVerify };