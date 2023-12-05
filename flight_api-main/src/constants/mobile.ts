import axios from "axios";
import { Request, Response } from "express";

interface VerificationResponse {
  success: boolean;
  message: string;
}

export async function verifyPhoneNumber(
  phone: string,
  verificationCode: string
): Promise<VerificationResponse> {
  const username = "mohamoha3zwgt2023";
  const password = "znmDP7KI";
  const from = "lamassu";
  const to = phone;
  const text = `This is your verification code: ${verificationCode}`;
  const type = 0;
  try {
    const response =
      await axios.post(`https://api.easysendsms.app/bulksms?username=${username}&password=${password}&from=${from}&to=${to}&text=${text}&type=${type}
        `);

    if (response.data.success) {
      return {
        success: true,
        message: "Verification code sent successfully.",
        // we save the verificationCode in a temperary local storage to be used later
      };
    } else {
      return {
        success: false,
        message: "Failed to send verification code.",
      };
    }
  } catch (error) {
    console.error("Error sending verification code:", error);
    return {
      success: false,
      message: "An error occurred while sending the verification code.",
    };
  }
}

export async function verifyCode(req: Request, res: Response) {
  const { phone, Code } = req.body;

  try {
    const verificationCode = getSavedVerificationCode(phone);

    if (verificationCode === Code) {
      markPhoneNumberAsVerified(phone);

      res.json({ message: "Phone number verified successfully." });
    } else {
      res.status(400).json({ message: "Invalid verification code." });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ message: "Error verifying verification code." });
  }
}

function getSavedVerificationCode(phone: string): string | undefined {
  // in this function we get the verificationCode we saved from the verifyPhoneNumber function
  return "code";
}

function markPhoneNumberAsVerified(phone: string): void {
  // here we mark the phone nhumber as Verified inside the database
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
