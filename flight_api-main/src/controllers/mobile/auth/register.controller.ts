import { content_url } from "./../../../constants/static_url";
import {
  Account,
  AccountPrivilege,
} from "./../../../interface/account.interface";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import AccountSchema from "../../../models/accounts";
import { errorRespond } from "../../../constants/responses/responses";
import { AccountAuth } from "../../../interface/account.interface";
import { sha512 } from "js-sha512";
import { Types } from "mongoose";
import {
  generateVerificationCode,
  verifyPhoneNumber,
} from "../../../constants/mobile";

export async function register(req: Request, res: Response) {
  let { name, phone, password_show } = req.body;
  const auth: AccountAuth = req.body.auth;

  if (!phone || !name || !password_show) {
    if (!password_show) {
      return res.status(400).json({ message: "يجب كتابة الاسم" });
    }
    if (!name) {
      return res.status(400).json({ message: "يجب كتابة الاسم" });
    }
    if (!phone) {
      return res.status(400).json({ message: "يجب كتابة الهاتف" });
    }
  }

  const password: string = sha512(password_show);

  const verificationCode = generateVerificationCode();

  try {
    const accountDB = new AccountSchema({
      name,
      type: "customer",
      phone,
      password_show,
      password,
    });
    await accountDB.save();

    if (!accountDB) {
      return res.status(400).json({ message: "حدث خطأ ما" });
    }

    await verifyPhoneNumber(phone, verificationCode);

    const accessToken: string = signTokenInJwt({
      _id: accountDB._id,
      name: accountDB.name,
      email: accountDB.email ? accountDB.email : null,
      phone: accountDB.phone ? accountDB.phone : null,
      type: accountDB.type!,
      center_id: accountDB.center_id,
    });

    await insertAuth(accountDB, accessToken, auth);

    res.json({
      results: {
        token: accessToken,
        _id: accountDB._id,
        name: accountDB.name,
        email: accountDB.email,
        phone: accountDB.phone,
        address: accountDB.address,
        type: accountDB.type,
        privileges: accountDB.privileges,
        center_id: accountDB.center_id,
        content_url,
      },
      error: false,
    });
  } catch (error) {
    console.log("error", error);

    res.json({
      error: true,
      message: errorRespond,
    });
  }
}

function signTokenInJwt(data: {
  _id: Types.ObjectId;
  name: string;
  email: string | null;
  phone: string | null;
  type: string;
  center_id: Types.ObjectId;
}) {
  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET!);

  return accessToken;
}

async function insertAuth(
  account: any,
  auth_token: string,
  auth: AccountAuth
): Promise<void> {
  await deleteAuthThatHasSameAuthPhoneInDB(account, auth.auth_phone_id);
  auth.auth_token = auth_token;
  await insertAuthInDB(account, auth);
}

async function deleteAuthThatHasSameAuthPhoneInDB(
  account: Account,
  auth_phone_id: string
) {
  await AccountSchema.updateOne(
    {
      _id: account._id,
    },
    {
      $pull: {
        auth: {
          auth_phone_id: auth_phone_id,
        },
      },
    }
  );
}

async function insertAuthInDB(account: Account, auth: AccountAuth) {
  await AccountSchema.updateOne(
    {
      _id: account._id,
    },
    {
      $push: {
        auth,
      },
    }
  );
}
