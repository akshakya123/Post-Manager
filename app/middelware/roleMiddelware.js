const { userModel } = require("../models");
const { findOne } = require("../services/modelServices");

const middelware = {};

middelware.roleChecker = (roles) =>
    async (req, res, next) => {
        try {
            const id = req.user.userId;
            const user = await findOne(userModel, { _id: id });
            if (!roles.includes(user.role)) {
                return res.status(401).json({ msg: message.FORBIDDEN });
            }
            next();
        } catch (err) {
            return res.status(401).json({ msg: "unauthorized" })
        }
    }

module.exports = middelware;