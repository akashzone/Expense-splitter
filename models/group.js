

const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    members : [
        {
            type: String,
            required : true
        }
    ],
});

const Group = mongoose.model("Group",GroupSchema);

module.exports = Group;

