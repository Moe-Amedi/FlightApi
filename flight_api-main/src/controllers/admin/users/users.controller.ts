import { Request, Response } from "express";
import AccountSchema from "../../../models/accounts";
import { errorEmailExistsRespond, errorRespond, errorSuccessEditingRespond, successAddingRespond, successEditingRespond } from "../../../constants/responses/responses";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import { sha512 } from "js-sha512";
import { isEmailExist } from "../../../constants/account";


export const getCenterUsers = async (req: Request, res: Response): Promise<Response> => {
    const center_id: string = req.params.center_id;

    try {
        const accounts = await AccountSchema.find({ center_id, is_deleted: false });

        return res.status(200).json({
            error: false,
            message: "Accounts fetched successfully",
            results: accounts
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: true,
            message: errorRespond,
            results: []
        });

    }

}


export const addCenterUser = async (req: Request, res: Response): Promise<Response> => {
    const center_id: string = req.body.center_id;
    const name: string = req.body.name;
    const email: string = req.body.email;
    const password_show: string = req.body.password_show;
    const password: string = sha512(password_show);
    const type: string = "admin";
    const phone: string | null = req.body.phone;

    if (await isEmailExist({ email, center_id })) {
        return res.status(200).json({
            error: true,
            message: errorEmailExistsRespond,
            results: null
        });
    }


    try {
        const account = await AccountSchema.create({
            name,
            phone,
            email,
            password_show,
            password,
            type,
            center_id
        });

        return res.status(200).json({
            error: false,
            message: successAddingRespond,
            results: account
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: true,
            message: errorRespond,
            results: {}
        });

    }
}


export const editCenterUser = async (req: Request, res: Response): Promise<Response> => {
    const account_id: string = req.body.account_id;
    const name: string = req.body.name;
    const email: string = req.body.email;
    const password_show: string = req.body.password_show;
    const password: string = sha512(password_show);
    const type: string = "admin";
    const phone: string | null = req.body.phone;

    try {
        const account = await AccountSchema.updateOne({ _id: new ObjectId(account_id) }, {
            name,
            phone,
            email,
            password_show,
            password,
            type,
        });

        if (account.modifiedCount == 0) {
            return res.status(200).json({
                error: true,
                message: errorSuccessEditingRespond,
            });
        } else {
            return res.status(200).json({
                error: false,
                message: successEditingRespond,
            });
        }

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: true,
            message: errorRespond,
        });

    }
}


export const removeCenterUser = async (req: Request, res: Response): Promise<Response> => {
    const account_id: string = req.params.account_id;

    try {
        const account = await AccountSchema.updateOne({ _id: new ObjectId(account_id) }, {
            is_deleted: true
        });

        if (account.modifiedCount == 0) {
            return res.status(200).json({
                error: true,
                message: errorSuccessEditingRespond,
            });
        } else {
            return res.status(200).json({
                error: false,
                message: successEditingRespond,
            });
        }

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: true,
            message: errorRespond,
        });

    }
}