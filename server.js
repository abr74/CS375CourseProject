const express = require('express');
const path = require('path');
const axios = require('axios');  // Import axios for API requests

const app = express();
const PORT = 3000;

const API_KEY = '9f92672f76ada425c25369464b8cb3fe'; // Your OpenWeather API key

app.use(express.static(path.join(__dirname)));

// Function to generate random latitude and longitude
function getRandomCoordinates() {
    const lat = (Math.random() * 180) - 90;  // Latitude between -90 and 90
    const lon = (Math.random() * 360) - 180; // Longitude between -180 and 180
    return { lat, lon };
}

// Endpoint to get weather data
app.get('/weather', async (req, res) => {
    try {
        // Generate random lat and lon for each request
        const { lat, lon } = getRandomCoordinates();

        // Fetch weather data using the random lat and lon
        const weatherData = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

        const temperature = Math.round((weatherData.data.main.temp - 273.15) * 9 / 5 + 32); // Fahrenheit
        console.log(`Temperature: ${temperature}°F at Lat: ${lat}, Lon: ${lon}`);

        // Respond with the temperature
        res.json({ temperature });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error fetching weather data');
    }
});

// Serve the game HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});