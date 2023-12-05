import { errorRespond } from './../../../constants/responses/responses';
import { Request, Response } from "express";
import AccountSchema from "../../../models/accounts";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export async function logout(req: Request, res: Response) {
    const token: string | undefined = req.headers["authorization"];
    const account_id: string = res.locals.user._id;

    try {
        const results = await AccountSchema.updateOne({
            _id: new ObjectId(account_id),
        }, {
            $pull: {
                auth: {
                    auth_token: token,
                },
            },
        });


        if (results.matchedCount == 0) {
            return res.status(500).json({
                error: true,
                message: errorRespond,
            });
        } else {
            return res.status(200).json({
                error: false,
                message: "تم تسجيل الخروج بنجاح",
            });
        }

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: errorRespond,
        });
    }
}
