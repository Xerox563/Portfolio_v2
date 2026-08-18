const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** Paste your free Web3Forms access key here (https://web3forms.com — no account needed).
 *  Or set VITE_WEB3FORMS_KEY in a .env file — the env var wins. */
const FALLBACK_ACCESS_KEY = "";

function accessKey(): string {
  return import.meta.env.VITE_WEB3FORMS_KEY ?? FALLBACK_ACCESS_KEY;
}

/** Send a contact message straight to the owner's inbox via Web3Forms. */
export async function sendContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const key = accessKey();
  if (!key) {
    throw new Error("Contact form is not configured yet.");
  }
  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: key,
      subject: `New message from ${input.name}`,
      from_name: input.name,
      from_email: input.email,
      reply_to: input.email,
      message: input.message,
    }),
  });
  if (!res.ok) {
    throw new Error("Message could not be sent. Please try again.");
  }
}
