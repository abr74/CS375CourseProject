const express = require('express');
const path = require('path');
const axios = require('axios');  // Import axios for API requests

const app = express();
const PORT = 3000;


const API_KEY = '9f92672f76ada425c25369464b8cb3fe';
const ZIP_CODE = '19446'; 


app.use(express.static(path.join(__dirname)));

// Endpoint to get weather data
app.get('/weather', async (req, res) => {
    try {

        const weatherData = await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${ZIP_CODE}&appid=${API_KEY}`);
        const temperature = Math.round((weatherData.data.main.temp - 273.15) * 9/5 + 32); // Temperature in Fahrenheit
        console.log(temperature);
        res.json({ temperature });
    } catch (error) {
        res.status(500).send('Error fetching weather data');
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
