const form = document.getElementById("weatherForm");

const cityInput = document.getElementById("cityInput");

const errorBox = document.getElementById("error");

const statusBox = document.getElementById("status");

const weatherSection =
    document.getElementById("weatherSection");

const emptyState =
    document.getElementById("emptyState");

const forecastContainer =
    document.getElementById("forecastContainer");



/*
    Weather Code Mapping
*/

const weatherCodes = {

    0: ["Clear Sky", "☀️"],

    1: ["Mainly Clear", "🌤️"],

    2: ["Partly Cloudy", "⛅"],

    3: ["Overcast", "☁️"],

    45: ["Fog", "🌫️"],

    48: ["Fog", "🌫️"],

    51: ["Light Drizzle", "🌦️"],

    53: ["Drizzle", "🌦️"],

    55: ["Heavy Drizzle", "🌧️"],

    56: ["Freezing Drizzle", "🌧️"],

    57: ["Freezing Drizzle", "🌧️"],

    61: ["Light Rain", "🌦️"],

    63: ["Rain", "🌧️"],

    65: ["Heavy Rain", "🌧️"],

    66: ["Freezing Rain", "🌧️"],

    67: ["Heavy Freezing Rain", "🌧️"],

    71: ["Light Snow", "🌨️"],

    73: ["Snow", "❄️"],

    75: ["Heavy Snow", "❄️"],

    77: ["Snow Grains", "❄️"],

    80: ["Rain Showers", "🌦️"],

    81: ["Rain Showers", "🌧️"],

    82: ["Heavy Rain Showers", "⛈️"],

    85: ["Snow Showers", "🌨️"],

    86: ["Heavy Snow Showers", "❄️"],

    95: ["Thunderstorm", "⛈️"],

    96: ["Thunderstorm With Hail", "⛈️"],

    99: ["Thunderstorm With Hail", "⛈️"]

};



/*
    Get weather condition
*/

function getWeather(code) {

    return weatherCodes[code]
        || ["Unknown", "🌡️"];

}



/*
    Fetch JSON Data
*/

async function fetchJSON(url) {

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            "API request failed"
        );

    }

    return await response.json();

}



/*
    Search City
*/

async function searchCity(city) {

    const url =
        new URL(
            "https://geocoding-api.open-meteo.com/v1/search"
        );


    url.searchParams.set(
        "name",
        city
    );


    url.searchParams.set(
        "count",
        "1"
    );


    url.searchParams.set(
        "language",
        "en"
    );


    url.searchParams.set(
        "format",
        "json"
    );


    const data =
        await fetchJSON(url);


    if (
        !data.results ||
        data.results.length === 0
    ) {

        throw new Error(
            "City not found. Please check the city name."
        );

    }


    return data.results[0];

}



/*
    Fetch Weather
*/

async function fetchWeather(
    latitude,
    longitude
) {

    const url =
        new URL(
            "https://api.open-meteo.com/v1/forecast"
        );


    url.searchParams.set(
        "latitude",
        latitude
    );


    url.searchParams.set(
        "longitude",
        longitude
    );


    url.searchParams.set(
        "current",
        "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m"
    );


    url.searchParams.set(
        "daily",
        "weather_code,temperature_2m_max,temperature_2m_min"
    );


    url.searchParams.set(
        "forecast_days",
        "5"
    );


    url.searchParams.set(
        "timezone",
        "auto"
    );


    return await fetchJSON(url);

}



/*
    Format Date
*/

function formatDate(dateString) {

    const date =
        new Date(
            `${dateString}T12:00:00`
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "short",
            day: "numeric",
            month: "short"
        }
    );

}



/*
    Render Weather
*/

function renderWeather(
    place,
    data
) {

    const current =
        data.current;


    const [
        condition,
        icon
    ] =
        getWeather(
            current.weather_code
        );



    /*
        Location
    */

    document.getElementById(
        "location"
    ).textContent =
        `${place.name}, ${place.country}`;



    /*
        Updated Time
    */

    document.getElementById(
        "updated"
    ).textContent =
        `Updated: ${new Date().toLocaleString()}`;



    /*
        Current Icon
    */

    document.getElementById(
        "currentIcon"
    ).textContent =
        icon;



    /*
        Temperature
    */

    document.getElementById(
        "temperature"
    ).textContent =
        Math.round(
            current.temperature_2m
        );



    /*
        Condition
    */

    document.getElementById(
        "condition"
    ).textContent =
        condition;



    /*
        Feels Like
    */

    document.getElementById(
        "feelsLike"
    ).textContent =
        `${Math.round(
            current.apparent_temperature
        )}°C`;



    /*
        Humidity
    */

    document.getElementById(
        "humidity"
    ).textContent =
        `${Math.round(
            current.relative_humidity_2m
        )}%`;



    /*
        Wind
    */

    document.getElementById(
        "wind"
    ).textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;



    /*
        5-Day Forecast
    */

    forecastContainer.innerHTML = "";


    for (
        let i = 0;
        i < data.daily.time.length;
        i++
    ) {

        const date =
            data.daily.time[i];


        const code =
            data.daily.weather_code[i];


        const max =
            data.daily.temperature_2m_max[i];


        const min =
            data.daily.temperature_2m_min[i];


        const [
            dayCondition,
            dayIcon
        ] =
            getWeather(code);



        const card =
            document.createElement(
                "div"
            );


        card.className =
            "forecast-card";


        card.innerHTML = `

            <h3>
                ${formatDate(date)}
            </h3>

            <div
                class="forecast-icon"
                title="${dayCondition}"
            >
                ${dayIcon}
            </div>

            <div>

                <span class="high">
                    ${Math.round(max)}°
                </span>

                <span class="low">
                    ${Math.round(min)}°
                </span>

            </div>

        `;


        forecastContainer.appendChild(
            card
        );

    }



    /*
        Show Weather
    */

    weatherSection.classList.remove(
        "hidden"
    );


    emptyState.classList.add(
        "hidden"
    );


    statusBox.textContent =
        "Live";

}



/*
    Loading State
*/

function setLoading(
    loading
) {

    const button =
        form.querySelector(
            "button"
        );


    if (loading) {

        button.disabled =
            true;

        button.textContent =
            "Loading...";

        statusBox.textContent =
            "Fetching...";

    } else {

        button.disabled =
            false;

        button.textContent =
            "Search";

    }

}



/*
    Show Error
*/

function showError(
    message
) {

    errorBox.textContent =
        message;

    statusBox.textContent =
        "Error";

}



/*
    Form Submit
*/

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const city =
            cityInput.value.trim();



        /*
            Validation
        */

        if (!city) {

            showError(
                "Please enter a city name."
            );

            cityInput.focus();

            return;

        }


        if (city.length < 2) {

            showError(
                "City name must contain at least 2 characters."
            );

            return;

        }



        /*
            Start Loading
        */

        setLoading(true);


        errorBox.textContent = "";



        try {

            /*
                Step 1:
                Find City Coordinates
            */

            const place =
                await searchCity(
                    city
                );



            /*
                Step 2:
                Get Weather
            */

            const weather =
                await fetchWeather(
                    place.latitude,
                    place.longitude
                );



            /*
                Step 3:
                Display Data
            */

            renderWeather(
                place,
                weather
            );


        }

        catch (error) {

            showError(
                error.message ||
                "Unable to load weather."
            );

        }

        finally {

            setLoading(false);

        }

    }
);