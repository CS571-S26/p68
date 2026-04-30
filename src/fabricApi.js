const WORKER_URL = "https://fabric.zhengtengyi.workers.dev";

const API_HEADERS = {
  "Content-Type": "application/json",
};

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

  const response = await fetch(WORKER_URL, {
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
if (!data.content) {
  throw new Error(`API error: ${JSON.stringify(data)}`);
}
const text = data.content.map((c) => c.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

export async function getRecommendations(analysisResult) {
  const response = await fetch(WORKER_URL, {
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
if (!data.content) throw new Error(`API error: ${JSON.stringify(data)}`);
const text = data.content.map((c) => c.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

export async function searchByQuery(query) {
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: API_HEADERS,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are a fashion and textile expert. The user will search either a fabric type or a garment type.
- If they search a fabric (e.g. "cotton", "silk", "denim"), recommend 6 garments ideal for that fabric.
- If they search a garment (e.g. "dress", "jacket", "shirt"), recommend 6 fabrics ideal for that garment.
Return ONLY a valid JSON object:
{
  "mode": "fabric_to_garment" | "garment_to_fabric",
  "inputLabel": string (what the user searched),
  "results": [
    {
      "name": string,
      "type": string,
      "emoji": string,
      "description": string,
      "tags": string[]
    }
  ]
}`,
      messages: [{ role: "user", content: `Search query: "${query}"` }],
    }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  if (!data.content) throw new Error(`API error: ${JSON.stringify(data)}`);
  const text = data.content.map((c) => c.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

export async function getShopRecommendations(analysisResult) {
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: API_HEADERS,
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are a fabric shop assistant. Given a fabric analysis, match it to the most similar products from our shop inventory and explain why each is a good match.
Return ONLY a valid JSON array of exactly 4 products matched from this inventory:
${JSON.stringify([
  { id: 1, name: "Premium Cotton Poplin", material: "100% Cotton", weight: "Lightweight", color: "#e8d5b7", price: "$12/yd", uses: ["Shirts", "Dresses", "Blouses"] },
  { id: 2, name: "Italian Wool Tweed", material: "90% Wool 10% Nylon", weight: "Heavyweight", color: "#6b5a4e", price: "$28/yd", uses: ["Coats", "Suits", "Jackets"] },
  { id: 3, name: "Stretch Denim", material: "98% Cotton 2% Elastane", weight: "Medium", color: "#3d5a80", price: "$15/yd", uses: ["Jeans", "Skirts", "Jackets"] },
  { id: 4, name: "Silk Charmeuse", material: "100% Silk", weight: "Lightweight", color: "#f0c8a0", price: "$45/yd", uses: ["Blouses", "Lingerie", "Scarves"] },
  { id: 5, name: "Linen Canvas", material: "100% Linen", weight: "Medium", color: "#c8b89a", price: "$18/yd", uses: ["Pants", "Blazers", "Tote Bags"] },
  { id: 6, name: "Velvet Crush", material: "80% Polyester 20% Nylon", weight: "Medium", color: "#7b4f8c", price: "$22/yd", uses: ["Dresses", "Blazers", "Cushions"] },
  { id: 7, name: "Jersey Knit", material: "95% Cotton 5% Elastane", weight: "Lightweight", color: "#e8e8e8", price: "$10/yd", uses: ["T-Shirts", "Leggings", "Dresses"] },
  { id: 8, name: "Cashmere Blend", material: "70% Cashmere 30% Wool", weight: "Medium", color: "#d4b896", price: "$65/yd", uses: ["Sweaters", "Scarves", "Cardigans"] },
  { id: 9, name: "Organza Sheer", material: "100% Polyester", weight: "Lightweight", color: "#f5e6d3", price: "$8/yd", uses: ["Evening Wear", "Overlays", "Veils"] },
  { id: 10, name: "Canvas Duck", material: "100% Cotton", weight: "Heavyweight", color: "#8b7355", price: "$9/yd", uses: ["Bags", "Workwear", "Upholstery"] },
  { id: 11, name: "Satin Duchess", material: "100% Polyester", weight: "Medium", color: "#f0e68c", price: "$16/yd", uses: ["Bridal", "Evening Wear", "Linings"] },
  { id: 12, name: "Fleece Polar", material: "100% Polyester", weight: "Heavyweight", color: "#c0c8d0", price: "$11/yd", uses: ["Jackets", "Blankets", "Sportswear"] },
])}

Return format:
[{
  "id": number,
  "name": string,
  "material": string,
  "weight": string,
  "color": string (hex),
  "price": string,
  "uses": string[],
  "matchScore": number (0-100),
  "matchReason": string (1-2 sentences why this matches)
}]`,
      messages: [{ role: "user", content: `Fabric analysis: ${JSON.stringify(analysisResult)}` }],
    }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  if (!data.content) throw new Error(`API error: ${JSON.stringify(data)}`);
  const text = data.content.map((c) => c.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}