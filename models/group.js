const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
}, { timestamps: true });

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;