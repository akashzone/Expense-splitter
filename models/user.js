const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
      },
});

const User = mongoose.model("User",UserSchema);
module.exports = User;

// const ParticipantSchema = new mongoose.Schema({
//   participants : [UserSchema],
// });

// const Participant = mongoose.model("participant",ParticipantSchema);
// module.exports = Participant;