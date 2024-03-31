import express from "express";
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const country_geojson = JSON.parse(fs.readFileSync(path.resolve('./countries.json'), 'utf8'));

const app = express();

app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.get('/country/:name', (req, res) => {
  const country = country_geojson.features.find(
    (feature) => feature.properties.ADMIN === req.params.name
  );
  if (country) {
    res.json(country);
  } else {
    res.status(404).send('Country not found');
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
  