const { v4: uuidv4 } = require('uuid');
const redisClient = require('../../utils/redis');
const Users  = require('../../models/user-schema');
const LoginHistory  = require('../../models/loginHistory-schema');

const login = async function(req, res){
    if(req.body.password && req.body.email){
        const userData = await Users.findOne({
            email: req.body.email,
            password: req.body.password
        })
        if(userData){
            const random = uuidv4();
            redisClient.set(random,`${userData}`);
            redisClient.expire(random, 60*2);
            LoginHistory.create({
                user: userData._id,
                newToken: random,
                createdOn: new Date()
            })
            return res.send({
                "message": "success",
                "token": random
            })
        }else{
            return res.send({
                "message": "Invalid email or password",
            })
        }
    }
    else {
        return res.send({"message": "Invalid Request"});
    }
}
module.exports = login;