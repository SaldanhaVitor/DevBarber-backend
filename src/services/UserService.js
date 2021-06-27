const User = require('../models/User');

class UserService {
    constructor() { }

    async create(body) {
        return await User.create(body);
    }

    async getUser(id) {
        return await User.findOne({ 'data.id': id });
    }

}

module.exports = UserService;