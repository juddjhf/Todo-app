const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  refreshtoken: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },

  userAgent: {
    type: String,
  },

  ipAddress: {
    type: String,
  },
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
