const jwt = require('jsonwebtoken');

class DecodeService {
    constructor() { }

    async execute(token) {
        const decoded = jwt.decode(token, { complete: true });
        return decoded;
    }
}

module.exports = DecodeService;