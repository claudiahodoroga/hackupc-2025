import { chatCompletion, parseJsonResponse, transcribeAudio } from "@/lib/tensorx";
import { DEMO_FRIENDS, DEMO_USER } from "@/lib/friends";

export const maxDuration = 60;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("audio_file");
    const productsRaw = formData.get("products");
    if (!file || typeof file === "string" || !file.type.startsWith("audio/")) {
      return Response.json({ detail: "File must be an audio file" }, { status: 400 });
    }
    if (!productsRaw) {
      return Response.json({ detail: "Missing products" }, { status: 400 });
    }
    const products = JSON.parse(productsRaw);
    const friendNames = DEMO_FRIENDS.map((f) => f.name);

    // Transcribe, hinting the friends' names so they are recognized correctly
    const text = await transcribeAudio(file, {
      language: "en",
      prompt:
        "Note that is possible that one or many of the following names appear: " +
        friendNames.join(", "),
    });

    // Extract who pays for what, then map the mentioned items onto the
    // actual receipt products — same two-step flow as the original backend.
    const identified = parseJsonResponse(
      await chatCompletion([
        {
          role: "user",
          content: extractionPrompt(text, DEMO_USER.name),
        },
      ])
    );

    const categorized = parseJsonResponse(
      await chatCompletion([
        {
          role: "user",
          content: categorizationPrompt(identified, Object.keys(products)),
        },
      ])
    );

    const validated = validateAssignments(categorized, Object.keys(products), [
      DEMO_USER.name,
      ...friendNames,
    ]);

    return Response.json({ transcript: text, assignments: validated });
  } catch (err) {
    console.error("Voice processing error:", err);
    return Response.json({ detail: "Please try again." }, { status: 500 });
  }
}

function extractionPrompt(sentence, userName) {
  return `You are a data extraction assistant. I will give you a sentence and you must identify who pays for each product.

Extract a JSON dictionary where the keys are the product names, and the values are lists of people who will pay for those products.
Note that if the first person ("I", "me") is used, you have to interpret it as a person called "${userName}".

Return only a valid JSON like this:
{ "pizza": ["Antonia", "Pepe"], "beverages": ["Marco"], "candies": ["Andres"] }

Rules:
- Return a valid JSON dictionary.
- Keys: products. Values: list of people paying for the product.
- Do NOT include anything else: no code fences, no explanations, no markdown, just JSON.
- Respect corrections, negations and handle human messes.

Sentence: ${sentence}`;
}

function categorizationPrompt(identified, productNames) {
  return `You are a product identifier expert and you will have to categorize products precisely.
I will give you a dictionary A of initial products and people who pay for them, and a list B of final products.
Your job is to map the initial products of dictionary A onto the products of list B.
Return a JSON dictionary with the same structure as A, but whose keys are ONLY products from list B, along with the people who pay for them.

Note that an initial product can be the same as a final one, an initial product can group several final products, or several initial products can map to one final product.

Rules:
- Return a valid JSON dictionary. Keys must come from list B exactly as written.
- Values: list of people paying for the product.
- Do NOT include anything else: no code fences, no explanations, no markdown, just JSON.

Dictionary A: ${JSON.stringify(identified)}
List B: ${JSON.stringify(productNames)}`;
}

function validateAssignments(data, productNames, knownPeople) {
  const result = {};
  if (!data || typeof data !== "object" || Array.isArray(data)) return result;
  const lowerProducts = new Map(productNames.map((p) => [p.toLowerCase(), p]));
  const lowerPeople = new Map(knownPeople.map((p) => [p.toLowerCase(), p]));
  for (const [product, people] of Object.entries(data)) {
    const canonical = lowerProducts.get(String(product).toLowerCase());
    if (!canonical || !Array.isArray(people)) continue;
    const names = people
      .map((p) => lowerPeople.get(String(p).toLowerCase()))
      .filter(Boolean);
    if (names.length > 0) result[canonical] = [...new Set(names)];
  }
  return result;
}
