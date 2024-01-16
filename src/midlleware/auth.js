const jwt = require('jsonwebtoken');
const userModel = require('../schema/userSchema');
require('dotenv').config()

const auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        let user = await userModel.findById(decodedToken._id)
        if (user) {
            next()
        } else {
            res.status(404).json({ isSuccess: false, data: {}, message:"unauthorized" })  
        }
       
      
    } catch (error) {
        res.status(404).json({ isSuccess: false, data: {}, message: error.message })
    }
}
module.exports = { auth }