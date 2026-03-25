"use server";
import { subscribeToNewsletter } from "@/lib/products";

export async function newsletterAction(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email || !email.includes("@")) {
    return { error: "Email invalid" };
  }
  
  const result = await subscribeToNewsletter(email);
  if (result.success) {
    return { success: true };
  } else {
    return { error: "Eroare la înscriere. Încearcă mai târziu." };
  }
}
