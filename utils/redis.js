const redis = require("redis");
const client = redis.createClient();
 
client.on("error", function(error) {
  console.error("ERROR",error);
});
 
// client.set("key", "value", redis.print);
// client.get("key", redis.print);

module.exports = client