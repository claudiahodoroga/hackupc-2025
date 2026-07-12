import { chatCompletion, parseJsonResponse, visionModel } from "@/lib/tensorx";

export const maxDuration = 60;

const EXTRACTION_PROMPT = `You are a data extraction assistant. I will give you a photo of a purchase receipt.

Your job is to identify each product on the receipt and extract a JSON dictionary where the keys are the product names and the values are their corresponding prices.

Return only a valid JSON object like this:
{
"product1": 1.50,
"product2": 3.00
}

Rules:
- The keys (products) must match how they appear on the receipt, as strings.
- The values must be numbers: the total sum of all occurrences of each product, rounded to two decimal places.
- If a product appears multiple times, add up its prices. Example: '1 Coca Cola 1.50' and then '1 Coca Cola 1.50' = "Coca Cola": 3.00
- Ignore irrelevant lines like totals, taxes, discounts or zero quantities.
- Do NOT include anything else: no code fences, no explanations, no markdown, just JSON.
- Do not include currency symbols.`;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image_file");
    if (!file || typeof file === "string" || !file.type.startsWith("image/")) {
      return Response.json({ detail: "File must be an image" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

    const raw = await chatCompletion(
      [
        {
          role: "user",
          content: [
            { type: "text", text: EXTRACTION_PROMPT },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      { model: visionModel() }
    );

    const items = validateItems(parseJsonResponse(raw));
    if (!items || Object.keys(items).length === 0) {
      return Response.json(
        { detail: "Could not read any items from the receipt. Please try again." },
        { status: 422 }
      );
    }
    return Response.json(items);
  } catch (err) {
    console.error("Image processing error:", err);
    return Response.json({ detail: "Please try again." }, { status: 500 });
  }
}

function validateItems(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const items = {};
  for (const [name, value] of Object.entries(data)) {
    const price = typeof value === "number" ? value : parseFloat(value);
    if (typeof name === "string" && Number.isFinite(price)) {
      items[name] = Math.round(price * 100) / 100;
    }
  }
  return items;
}
