app.get('/test', (req, res) => {
  res.send('✅ Express server is working!');
});


const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const sightingsFile = path.join(__dirname, 'sightings.json');

app.use(express.json());
app.use(express.static('public'));

// Load sightings
app.get('/api/sightings', (req, res) => {
  fs.readFile(sightingsFile, 'utf8', (err, data) => {
    if (err) {
      console.error("Failed to read sightings:", err);
      return res.status(500).json({ error: 'Failed to read sightings.' });
    }
    res.json(JSON.parse(data || '[]'));
  });
});

// Save new sighting
app.post('/api/sightings', (req, res) => {
  console.log("Incoming POST /api/sightings", req.body);

  fs.readFile(sightingsFile, 'utf8', (err, data) => {
    const sightings = data ? JSON.parse(data) : [];
    sightings.push(req.body);

    fs.writeFile(sightingsFile, JSON.stringify(sightings, null, 2), err => {
      if (err) {
        console.error("Failed to write to sightings file:", err);
        return res.status(500).json({ error: 'Failed to save sighting.' });
      }
      res.status(201).json({ message: 'Sighting saved.' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
