const redisClient = require('../../utils/redis');
const loginHistory = require('../../models/loginHistory-schema');
const details = function(req, res){
    if(req.query.token){
       redisClient.get(`${req.query.token}`, async (err, reply)=>{
           if(reply){
            redisClient.expire(`${req.query.token}`, 60*2);
            //get details of that user from the loginhistory schema.
            const detail = await loginHistory.findOne({newToken: req.query.token})
            .populate({
                path: "user",
                select: "name email",
            })
            .select("newToken");

            return res.send({
                "message": "success",
                "data": detail,
                "token": req.query.token
            })
           } else {
            return res.send({
                "message": "Token expired, login to continue",
            })
           }
       })
    //    return res.send({"message": redisClient.get(`${req.query.token}`)})
    }
    else {
        return res.send({"message": "Invalid Request"});
    }
}
module.exports = details