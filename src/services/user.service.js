const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return User.create(userBody);
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
    const user = await User.findOne({
        where: {
            id: id
        }
    });
    return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    const user = await User.findOne({
        where: {
            email
        }
    });
    return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
    let user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot update email');
    }
   user = await User.update(updateBody, {
       where: {
           id: user.id
       }
   });
    return user;
};
module.exports = {
    createUser,
    getUserById,
    getUserByEmail,
    updateUserById
};
