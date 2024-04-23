const express = require('express');
const router = express.Router();
const EntryTime = require('../models/entryTime');

router.get('/', async (req, res) => {
    try {
        const entryTimes = await EntryTime.find();
        res.json(entryTimes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

    router.get('/employee', async (req, res) => {
        try {
            const id = req.query.id;
            console.log(id);
            const entryTime = await EntryTime.find({ employeeId: id });
            res.json(entryTime);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
    
// router.post('/', async (req, res) => {
//     const employeeId = req.body.employeeId;
//     const employeeName = req.body.employeeName;
//     //get current time
//     const currTime = new Date();
//     //check for the latest entryTime for the employee if both inTime and outTime are already set then create a new entryTime if only inTime is set then update the outTime 
//     const entryTime = await EntryTime.findOne({employeeId: employeeId}).sort({inTime: -1});
//     if(entryTime && !entryTime.outTime){
//         entryTime.outTime = currTime;
//         await entryTime.save();
//         res.status(201).json(entryTime);
//     }
//     else{
//         const newEntryTime = new EntryTime({
//             employeeId: employeeId,
//             employeeName: employeeName,
//             inTime: currTime
//         });
//         try {
//             const savedEntryTime = await newEntryTime.save();
//             res.status(201).json(savedEntryTime);
//         } catch (err) {
//             res.status(400).json({ message: err.message });
//         }
//     }
// });

module.exports = router;