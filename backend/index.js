const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Groq = require("groq-sdk");
const dotenv = require('dotenv'); // Make sure to import dotenv

dotenv.config(); // Load environment variables

const app = express();
const port = 5000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(bodyParser.json());

// Endpoint to save appointment
app.post('/save-appointment', (req, res) => {
  const newAppointment = req.body;
  const filePath = path.join(__dirname, 'info.json');
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read file' });
    }

    const appointments = JSON.parse(data);
    newAppointment.id = appointments.length + 1;
    appointments.push(newAppointment);

    fs.writeFile(filePath, JSON.stringify(appointments, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to write file' });
      }

      res.json({ message: 'Appointment saved successfully' });
    });
  });
});


app.post('/save-report', (req, res) => {
  const report = req.body;
  const filePath = path.join(__dirname, 'reports.json');

  fs.writeFile(filePath, JSON.stringify(report, null, 2), (err) => {
    if (err) {
      console.error('Error saving report:', err);
      return res.status(500).send('Error saving report');
    }
    res.send('Report saved successfully');
  });
});



// Endpoint to get appointments
app.get('/appointments', (req, res) => {
  const filePath = path.join(__dirname, 'info.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read file' });
    }

    let appointments;
    try {
      appointments = JSON.parse(data);
    } catch (error) {
      return res.status(500).json({ error: 'Invalid JSON in file' });
    }

    res.json(appointments);
  });
});

async function getGroqChatCompletion(prompt) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-8b-8192",
  });
}

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;  // Use req.body to get the prompt

  if (!prompt) {
    return res.status(400).send("Missing prompt in request body");
  }

  try {
    const chatCompletion = await getGroqChatCompletion(prompt);
    res.send(chatCompletion.choices[0]?.message?.content || "");
  } catch (error) {
    console.error("Error querying Groq AI:", error);
    res.status(500).send("Error querying Groq AI");
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
