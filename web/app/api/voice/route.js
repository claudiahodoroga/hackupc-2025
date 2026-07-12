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

    // Single LLM call: extract who pays for what AND map the mentioned items
    // onto the actual receipt products (the original backend did this in two
    // steps, but one call keeps us well within the serverless time budget).
    const assignments = parseJsonResponse(
      await chatCompletion([
        {
          role: "user",
          content: assignmentPrompt(
            text,
            DEMO_USER.name,
            Object.keys(products),
            [DEMO_USER.name, ...friendNames]
          ),
        },
      ])
    );

    const validated = validateAssignments(assignments, Object.keys(products), [
      DEMO_USER.name,
      ...friendNames,
    ]);

    return Response.json({ transcript: text, assignments: validated });
  } catch (err) {
    console.error("Voice processing error:", err);
    return Response.json({ detail: "Please try again." }, { status: 500 });
  }
}

function assignmentPrompt(sentence, userName, productNames, knownPeople) {
  return `You are a bill-splitting assistant. I will give you a sentence describing who pays for what, a list of receipt products, and a list of known people.

Your job:
1. Identify from the sentence which person pays for which products. If the first person ("I", "me") is used, interpret it as "${userName}".
2. Map every mentioned product onto the receipt products in list B (a mentioned product may match one receipt product, group several, or several mentions may map to one).

Return only a valid JSON dictionary whose keys are ONLY products from list B (exactly as written) and whose values are lists of people (from the known people list) paying for them, like:
{ "Fries": ["Antonia", "Pepe"], "Coke": ["Marco"] }

Rules:
- Do NOT include anything else: no code fences, no explanations, no markdown, just JSON.
- Respect corrections, negations and handle human messes.
- Omit receipt products nobody was assigned to.

Sentence: ${sentence}
List B (receipt products): ${JSON.stringify(productNames)}
Known people: ${JSON.stringify(knownPeople)}`;
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
