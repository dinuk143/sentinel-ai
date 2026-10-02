const axios = require("axios");

async function findNearbyPlaces(lat, lng, amenity) {

    const query = `
    [out:json];
    (
      node["amenity"="${amenity}"](around:5000,${lat},${lng});
    );
    out;
    `;

    const url = "https://overpass-api.de/api/interpreter";

    const response = await axios.post(
        url,
        query,
        {
            headers: {
                "Content-Type": "text/plain"
            }
        }
    );

    return response.data.elements.slice(0, 5);

}

module.exports = {
    findNearbyPlaces
};