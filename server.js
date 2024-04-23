const express = require('express');
const http = require('http');
const cors = require('cors');
const employeeRouter = require('./routes/employee');
const mongoose = require('mongoose');
const mqtt = require('mqtt'); // Include the MQTT.js library

const mongoURI = 'mongodb+srv://202152323:202152323@cluster0.r5sbybc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const mqttBrokerUrl = 'mqtt://broker.hivemq.com:1883'; // Replace with your MQTT broker URL
const mqttTopic = 'rfid/data'; // MQTT topic to subscribe to
const EntryTime = require('./models/entryTime');

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB', err);
});

const app = express();
app.use(cors());
const server = http.createServer(app);
app.use(express.json());
app.use('/api', employeeRouter);


// MQTT client setup
const client = mqtt.connect(mqttBrokerUrl);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(mqttTopic); // Subscribe to MQTT topic
});

client.on('message', async (topic, message) => {
  // Handle received message
  if (topic === mqttTopic) {
    const data = message.toString(); // Convert buffer to string
    console.log('Received RFID data:', data);

    // Separate the elements
    const elements = data.split(',');
    const employeeID = elements[1];
    const employeeName = elements[2];
    const department = elements[3];
    console.log('Employee ID:', employeeID);
    console.log('Employee Name:', employeeName);
    console.log('Department:', department);

    // Get current time
    const currTime = new Date();

    // Check for the latest entryTime for the employee
    const entryTime = await EntryTime.findOne({ employeeId: employeeID }).sort({ inTime: -1 });
    if (entryTime && !entryTime.outTime) {
      // Update the existing entryTime with outTime
      entryTime.outTime = currTime;
      await entryTime.save();
      console.log('Updated existing entryTime:', entryTime);
    } else {
      // Create a new entryTime if no existing or outTime already set
      const newEntryTime = new EntryTime({
        employeeId: employeeID,
        employeeName: employeeName,
        department: department,
        inTime: currTime
      });
      try {
        const savedEntryTime = await newEntryTime.save();
        console.log('Saved new entryTime:', savedEntryTime);
      } catch (err) {
        console.error('Error saving new entryTime:', err.message);
      }
    }
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
