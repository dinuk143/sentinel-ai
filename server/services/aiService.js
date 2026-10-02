const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// ================= MIME TYPE =================

function getMimeType(imagePath) {

    const ext = path
        .extname(imagePath)
        .toLowerCase();

    if (ext === ".png") {
        return "image/png";
    }

    if (ext === ".webp") {
        return "image/webp";
    }

    if (ext === ".jpg" || ext === ".jpeg") {
        return "image/jpeg";
    }

    return "image/jpeg";
}


// ================= ANALYZE IMAGE =================

async function analyzeImage(imagePath) {

    try {

        if (!imagePath) {
            throw new Error("Image path is missing");
        }

        if (!fs.existsSync(imagePath)) {
            throw new Error(
                `Image file not found: ${imagePath}`
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            throw new Error(
                "GEMINI_API_KEY is missing"
            );
        }

        console.log(
            "🤖 Starting Gemini image analysis..."
        );

        console.log(
            "Image path:",
            imagePath
        );

        const imageBuffer =
            fs.readFileSync(imagePath);

        const base64Image =
            imageBuffer.toString("base64");

        const mimeType =
            getMimeType(imagePath);


        const prompt = `
You are Sentinel AI, an emergency image analysis assistant.

Analyze the provided image.

Identify the most likely emergency type.

Allowed emergency types:

- Fire
- Road Accident
- Flood
- Violence
- Medical Emergency
- Snake Bite
- Dog Bite
- Burns
- Electric Shock
- Drowning
- Choking
- Unknown

Estimate severity using only:

- Low
- Medium
- High
- Critical

Then provide one short and practical immediate safety instruction.

Do not claim certainty if the image is unclear.

Return ONLY valid JSON in this exact structure:

{
  "emergencyType": "Unknown",
  "severity": "Low",
  "guidance": "Short emergency guidance"
}
`;


        const response =
            await ai.models.generateContent({

                model:
                    "gemini-3.8-flash",

                contents: [
                    {
                        role: "user",

                        parts: [

                            {
                                text: prompt
                            },

                            {
                                inlineData: {

                                    mimeType:
                                        mimeType,

                                    data:
                                        base64Image

                                }
                            }

                        ]
                    }
                ],

                config: {

                    responseMimeType:
                        "application/json"

                }

            });


        let text =
            response.text?.trim();

        console.log(
            "Gemini Raw Response:"
        );

        console.log(text);


        if (!text) {

            throw new Error(
                "Gemini returned empty response"
            );

        }


        text = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();


        const result =
            JSON.parse(text);


        console.log(
            "✅ Gemini Analysis:",
            result
        );


        return {

            emergencyType:
                result.emergencyType ||
                "Unknown",

            severity:
                result.severity ||
                "Medium",

            guidance:
                result.guidance ||
                "Call emergency services if immediate help is required."

        };


    } catch (error) {

        console.error(
            "❌ GEMINI ANALYSIS ERROR"
        );

        console.error(
            error.message
        );

        console.error(error);


        /*
        IMPORTANT:
        We return fallback data instead
        of crashing the SOS request.
        */

        return {

            emergencyType:
                "Unknown",

            severity:
                "Medium",

            guidance:
                "AI analysis is currently unavailable. Contact emergency services if immediate help is required."

        };

    }

}


module.exports = {
    analyzeImage
};