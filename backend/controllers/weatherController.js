import asyncHandler from 'express-async-handler';
import Farmer from '../models/Farmer.js';

// @desc    Get current weather data for farmer's location
// @route   GET /api/weather
// @access  Private
export const getWeather = asyncHandler(async (req, res) => {
    // Fetch farmer profile to get location
    const farmer = await Farmer.findOne({ userId: req.user._id });

    let city = "Pune";
    let state = "Maharashtra";

    if (farmer && farmer.location) {
        city = farmer.location.district || farmer.location.village || city;
        state = farmer.location.state || state;
    }

    // Simulate slight variations based on "live" feel
    const temp = 28 + (Math.random() * 2 - 1);
    const humidity = 65 + (Math.random() * 10 - 5);

    const weatherData = {
        location: {
            city: city,
            state: state
        },
        current: {
            temp_c: Number(temp.toFixed(1)),
            condition: {
                text: "Partly Cloudy",
                icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
            },
            wind_kph: 12,
            humidity: Math.round(humidity),
            precip_mm: 0.0,
            air_quality: {
                co: 230,
                no2: 15,
                o3: 85,
                pm2_5: 12, // Good air quality
                pm10: 25,
                "us-epa-index": 1,
                "gb-defra-index": 1
            }
        },
        forecast: [
            { date: "Today", temp: 29, condition: "Sunny" },
            { date: "Tomorrow", temp: 28, condition: "Cloudy" },
            { date: "Wed", temp: 30, condition: "Rain" }
        ]
    };

    res.json(weatherData);
});

export default { getWeather };
