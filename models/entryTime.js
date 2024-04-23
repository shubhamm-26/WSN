const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entryTimeSchema = new Schema({
    employeeId: {
        type: String,
        required: false
    },
    employeeName: {
        type: String,
        required: false
    },
    department: {
        type: String,
        required: false
    },
    inTime: {
        type: Date,
        required: false
    },
    outTime: {
        type: Date,
        required: false
    }
    });

module.exports = mongoose.model('EntryTime', entryTimeSchema);

