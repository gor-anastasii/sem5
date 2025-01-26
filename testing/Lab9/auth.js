const { db } = require('./db');

const registerUser = async (id, name, birthday) => {
    const newUser = { id, name, birthday };
    await db.insert(newUser); 
    return newUser;
};

const authenticateUser = async (id) => {
    const users = await db.select();
    return users.find(user => user.id === id) || null;
};

module.exports = { registerUser, authenticateUser };