var mongoose = require("mongoose");

var jobsInfo = new mongoose.Schema(
{
	name: {
		type: String,
		optional: false,
		required: true,
        trim:true
	},
	profile:{
		type: String,
		trim:true,
		optional: true
	},
    resume:{
		type: String,
		trim:true,
		optional: false
	},
    email: {
		type: String,
		optional: false,
		required: true,
        trim:true
	},
    technical_skill:{
        type: String,
		optional: false,
		required: true,
        trim:true
    },
    mobile_number: {
		type: Number,
        default:0
	},
    birthdate: {
		type: Date,
        default:new Date(),
	},
	isDelete:{
		type: Boolean,
		default:false
	}
},
	{ timestamps: true }
);
module.exports = mongoose.model("jobsInfo", jobsInfo);