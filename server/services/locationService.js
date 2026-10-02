const axios = require("axios");

async function findNearby(latitude, longitude, type) {

    const query = `
    [out:json];

    (
      node["amenity"="${type}"](around:5000,${latitude},${longitude});
      way["amenity"="${type}"](around:5000,${latitude},${longitude});
      relation["amenity"="${type}"](around:5000,${latitude},${longitude});
    );

    out center 5;
    `;

    const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        {
            headers: {
                "Content-Type": "text/plain"
            }
        }
    );

    return response.data.elements;

}

module.exports = {
    findNearby
};