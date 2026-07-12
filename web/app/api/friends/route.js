import { DEMO_FRIENDS, DEMO_USER } from "@/lib/friends";

export function GET() {
  // Include the demo user so first-person voice assignments ("I'll pay...")
  // show up in the list and can also be toggled manually.
  return Response.json({ user: DEMO_USER, friends: [DEMO_USER, ...DEMO_FRIENDS] });
}
