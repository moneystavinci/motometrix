import mailchimp from "@mailchimp/mailchimp_marketing";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

/**
 * Fire-and-forget Mailchimp sync.
 * Upserts the user into the configured Mailchimp audience list
 * (works whether or not the email already exists in the audience).
 * Marks mailchimpSynced = true in DB on success.
 * Never throws — caller should .catch() silently.
 */
export async function syncToMailchimp(
  userId: string,
  email: string,
  name: string
): Promise<void> {
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!audienceId || !process.env.MAILCHIMP_API_KEY) {
    console.warn("[Mailchimp] Missing API key or audience ID — skipping sync.");
    return;
  }

  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  // Mailchimp's setListMember (upsert) requires the MD5 hash of the
  // lowercased email as the subscriber hash / member ID.
  const subscriberHash = crypto
    .createHash("md5")
    .update(email.toLowerCase())
    .digest("hex");

  await mailchimp.lists.setListMember(audienceId, subscriberHash, {
    email_address: email,
    status_if_new: "subscribed",
    merge_fields: {
      FNAME: firstName ?? "",
      LNAME: lastName ?? "",
      SIGNUPDATE: new Date().toISOString().split("T")[0],
    },
  });

  // Tags must be set in a separate call
  await mailchimp.lists.updateListMemberTags(audienceId, subscriberHash, {
    tags: [{ name: "motometrix-signup", status: "active" }],
  });

  await prisma.user.update({
    where: { id: userId },
    data: { mailchimpSynced: true },
  });
}