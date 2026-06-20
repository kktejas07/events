import { randomInt } from "crypto";
import { db } from "@/lib/db";

export function generateOTP(length = 6): string {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(randomInt(min, max));
}

export function getOTPExpiry(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export async function createOTP(email: string) {
  const token = generateOTP();
  const expires = getOTPExpiry(10);

  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

export async function verifyOTP(email: string, token: string): Promise<boolean> {
  const record = await db.verificationToken.findFirst({
    where: {
      identifier: email,
      token,
      expires: { gt: new Date() },
    },
  });

  if (!record) return false;

  await db.verificationToken.delete({
    where: { identifier_token: { identifier: email, token } },
  });

  return true;
}
