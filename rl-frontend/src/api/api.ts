export const API_URL = "http://localhost:8000";

export async function createListing(data: { propertyReference: string; agent: string }) {
  await fetch(`${API_URL}/listing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getListings() {
  const res = await fetch(`${API_URL}/listing`);
  return res.json();
};
