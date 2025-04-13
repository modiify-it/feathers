const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const sightingsFile = path.join(__dirname, 'sightings.json');

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve HTML/CSS/JS from "public" folder

// Health check
app.get('/test', (req, res) => {
  res.send('Server is working! ✅');
});

// Get all sightings
app.get('/api/sightings', (req, res) => {
  fs.readFile(sightingsFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading sightings:', err);
      return res.status(500).json({ error: 'Failed to read sightings.' });
    }

    try {
      const parsed = JSON.parse(data || '[]');
      res.json(parsed);
    } catch (parseError) {
      res.status(500).json({ error: 'Corrupted sightings file.' });
    }
  });
});

// Post new sighting
app.post('/api/sightings', (req, res) => {
  const newSighting = req.body;

  fs.readFile(sightingsFile, 'utf8', (err, data) => {
    const sightings = data ? JSON.parse(data) : [];
    sightings.push(newSighting);

    fs.writeFile(sightingsFile, JSON.stringify(sightings, null, 2), err => {
      if (err) {
        console.error('Error writing to sightings file:', err);
        return res.status(500).json({ error: 'Failed to save sighting.' });
      }

      res.status(201).json({ message: 'Sighting saved.' });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
