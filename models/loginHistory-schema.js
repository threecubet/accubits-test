
const mongoose = require("mongoose");

const loginHistory = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  newToken: String,
  createdOn: {
      type: Date,
      default: new Date()
  }
});

loginHistory.pre("save", function(next) {
  next();
});

const LoginHistory = mongoose.model("loginhistory", loginHistory);

module.exports = LoginHistory