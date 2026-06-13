/**
 * AES-256-GCM encryption for storing Google OAuth tokens securely in Postgres.
 * The ENCRYPTION_KEY env var must be a 64-character hex string (32 bytes).
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM

function getKeyMaterial(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY environment variable is not set.");
  if (key.length !== 64)
    throw new Error("ENCRYPTION_KEY must be 64 hex characters (32 bytes).");
  return key;
}

async function importKey(): Promise<CryptoKey> {
  const keyHex = getKeyMaterial();
  const keyBytes = Buffer.from(keyHex, "hex");
  return crypto.subtle.importKey("raw", keyBytes, { name: ALGORITHM, length: KEY_LENGTH }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encrypt(plaintext: string): Promise<string> {
  const key = await importKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encoded);

  // Store as: hex(iv):base64(ciphertext)
  const ivHex = Buffer.from(iv).toString("hex");
  const ctBase64 = Buffer.from(ciphertext).toString("base64");
  return `${ivHex}:${ctBase64}`;
}

export async function decrypt(encrypted: string): Promise<string> {
  const [ivHex, ctBase64] = encrypted.split(":");
  if (!ivHex || !ctBase64) throw new Error("Invalid encrypted token format.");

  const key = await importKey();
  const iv = Buffer.from(ivHex, "hex");
  const ciphertext = Buffer.from(ctBase64, "base64");

  const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}
