const { assert } = require('chai');

const { emailVerify } = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('emailVerify', function () {
  it('should return a user with valid email', function () {
    const user = emailVerify("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    // assert.strictEqual("user@example.com", testUsers[email],"Message" )
    assert.strictEqual(user.id, expectedOutput)
  });
  it('should return a user as undefined', function () {
    const user = emailVerify("user@where.com", testUsers)
    const expectedOutput = undefined;
    // Write your assert statement here
    // assert.strictEqual("user@example.com", testUsers[email],"Message" )
    assert.strictEqual(user.id, expectedOutput)
  });
  it('should return a user undefined when the email is not given', function () {
    const user = emailVerify("", testUsers)
    const expectedOutput = undefined;
    // Write your assert statement here
    // assert.strictEqual("user@example.com", testUsers[email],"Message" )
    assert.strictEqual(user.id, expectedOutput)
  });
});