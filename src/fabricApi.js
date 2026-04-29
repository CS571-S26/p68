const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const API_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
};
// change4

const ANALYSIS_SYSTEM = `You are a professional textile analyst. Analyze the fabric or garment in the image.
Return ONLY a valid JSON object with no extra text, markdown, or code fences. The JSON must have:
{
  "fabricName": string (e.g. "Cotton Jersey", "Wool Tweed"),
  "confidence": number (0-100),
  "composition": [{ "name": string, "percent": number }],
  "texture": string[] (2-4 descriptors, e.g. ["Knit", "Smooth", "Lightweight"]),
  "properties": string[] (3-5 descriptors, e.g. ["Breathable", "Stretchy", "Machine washable"]),
  "care": [{ "symbol": string (emoji), "label": string }],
  "season": string[] (e.g. ["Spring", "Summer"]),
  "weight": string (e.g. "Lightweight", "Medium", "Heavyweight"),
  "description": string (2-3 sentences about this fabric)
}`;

const RECOMMEND_SYSTEM = `You are a fashion designer and textile expert. Given a fabric analysis, recommend garments that would be ideal for this fabric.
Return ONLY a valid JSON array (no extra text) of exactly 6 garment objects:
[{
  "name": string (specific garment name, e.g. "Relaxed Linen Trousers"),
  "type": string (category, e.g. "Bottoms", "Outerwear", "Tops"),
  "emoji": string (single emoji representing the garment),
  "description": string (2 sentences explaining why this fabric suits this garment),
  "tags": string[] (3-4 style/occasion tags, e.g. ["Casual", "Summer", "Easy care"])
}]`;

export async function analyzeFabric(imageDataUrl) {
  const [header, base64] = imageDataUrl.split(",");
  const mediaType = header.match(/:(.*?);/)[1];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: API_HEADERS,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: ANALYSIS_SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: "Analyze this fabric/garment image and return the JSON.",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.content.map((c) => c.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

export async function getRecommendations(analysisResult) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: API_HEADERS,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: RECOMMEND_SYSTEM,
      messages: [
        {
          role: "user",
          content: `Fabric analysis:\n${JSON.stringify(analysisResult, null, 2)}\n\nReturn the JSON array.`,
        },
      ],
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.content.map((c) => c.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}