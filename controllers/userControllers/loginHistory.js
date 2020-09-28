const redisClient = require('../../utils/redis');
const loginHistory = require('../../models/loginHistory-schema');
// const users = require('../../models/user-schema');
const loginHistoryDetails = function(req, res){
    if(req.query.token){
        let expired;
       redisClient.get(`${req.query.token}`, async(err, reply)=>{
           if(reply){
               console.log(reply);
                const detail = await loginHistory.findOne({newToken: req.query.token}).select("user");
                const history = await loginHistory.find({user:detail.user});
                return res.send({
                    "message": "success",
                    "data": history
                })
           } else {
                return res.send({
                    "message": "Token expired",
                })
           }
       })
    }
    else {
        return res.send({"message": "Invalid Request"});
    }
}
module.exports = loginHistoryDetails