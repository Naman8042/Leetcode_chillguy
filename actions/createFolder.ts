"use server";

import { revalidatePath } from "next/cache";

export async function createFolder(formData: FormData) {
  const folderName = formData.get("folderName") as string;
  if (!folderName) return;

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/codesnippet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: folderName }),
  });

  revalidatePath("/");
}