import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import * as dotenv from "dotenv";
import AccountSchema from "../models/accounts";
import { Account } from "../interface/account.interface";

dotenv.config({ path: "../.env" });

export async function authenticateTokenDB(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];

  const accessToken: string | undefined = authHeader &&
    authHeader.split(" ")[0];

  if (!accessToken) {
    return res.sendStatus(401);
  } else {
    let isAccountHaveAuthInDB = await isAccountHaveAuth(accessToken);

    if (!isAccountHaveAuthInDB) return res.sendStatus(401);
  }

  // else if (getAuth[0].auth_active == 0) return res.json({ error: "notActive" });

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) return res.json({ error: true });

    res.locals = {
      ...res.locals,
      user: user,
    };

    next();
  });
}

export async function isAccountHaveAuth(
  token: string,
): Promise<Account | null> {
  var resultsDB: any = await AccountSchema.findOne({
    "auth.auth_token": token,
  });

  return resultsDB;
}


export async function getAccountInfoForChat(
  token: string,
): Promise<any | null> {
  var resultsDB: Account[] = await AccountSchema.aggregate([
    {
      $match: {
        "auth.auth_token": token
      }
    },

    {
      $addFields: {
        auth: {
          $filter: {
            input: '$auth',
            as: 'item',
            cond: { $eq: ['$$item.auth_token', token] }
          }
        }
      }
    },
    {
      $addFields: { auth: { $first: "$auth" } }
    },
    {
      $project: {
        _id: 1,
        account_name: 1,
        account_img: 1,
        account_school: 1,
        account_type: 1,
        auth: 1
      }
    }
  ]);
  let results = resultsDB.length >= 1 ? resultsDB[0] : null
  return results;
}
