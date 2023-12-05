import { Request, Response } from "express";
import { errorEmailExistsRespond, errorRespond, errorSuccessEditingRespond, errorSuccessRemovingRespond, successAddingRespond, successEditingRespond, successRemovingRespond } from "../../../constants/responses/responses";
import AccountSchema from "../../../models/accounts";
import mongoose from "mongoose";
import { isEmailExist, isEmailExistExceptThisId } from "../../../constants/account";
import { web_sort_condition } from "../../../constants/dashboard";
import { ISortBy } from "../../../interface/sortBy.interface.";
import { sha512 } from "js-sha512";
import { AccountType } from "../../../interface/account.interface";
const ObjectId = mongoose.Types.ObjectId;


export const addUser = async (req: Request, res: Response): Promise<Response> => {

    const center_id: string = res.locals.user.center_id._id;
    const name: string = req.body.name;
    const email: string = req.body.email;
    const phone: string = req.body.phone;
    const password_show: string = req.body.password_show;
    const password: string = sha512(password_show);
    const type: AccountType = "assistance";
    const actions: string[] = req.body.actions;
    const address: string = req.body.address;

    if (await isEmailExist({ email, center_id })) {
        return res.status(500).json({
            error: true,
            message: errorEmailExistsRespond,
        });
    }

    try {
        const account = new AccountSchema({
            name,
            email,
            phone,
            password,
            password_show,
            type,
            privileges: {
                actions,
            },
            address,
            center_id,
        });

        await account.save();

        return res.status(201).json({
            error: false,
            message: successAddingRespond,
            results: account
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: true,
            message: errorRespond,
            results: error
        });

    }
}

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    const center_id: string = res.locals.user.center_id._id;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip: number = (page - 1) * limit;
    const search: string = req.query.search as string;

    const sortBy: ISortBy = req.query.sortBy ? JSON.parse(req.query.sortBy as string) : [];

    let sort_condition: any = web_sort_condition([sortBy]);


    let search_condition: any = {};
    if (search && search.length >= 1 && search != "null") {
        search_condition = {
            $or: [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    phone: {
                        $regex: search,
                        $options: "i",
                    },
                },

                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ],
        };
    }

    const main_match = {
        center_id: new ObjectId(center_id),
        type: "assistance",
        is_deleted: false,
    };




    try {

        const results = await AccountSchema.aggregate([
            {
                $facet: {
                    data: [
                        {
                            $match: main_match
                        },
                        // search
                        {
                            $match: search_condition,
                        },
                        // sort
                        {
                            $sort: sort_condition,
                        },
                        {
                            $skip: skip,
                        },
                        {
                            $limit: limit,
                        },
                    ],
                    count: [
                        {
                            $match: main_match
                        },
                        // search
                        {
                            $match: search_condition,
                        },
                        {
                            $count: "count",
                        },
                    ],
                },
            },
            {
                $addFields: {
                    count: {
                        $cond: {
                            if: {
                                $gt: [
                                    {
                                        $size: "$count",
                                    },
                                    0,
                                ],
                            },

                            then: {
                                $first: "$count.count",
                            },

                            else: 0,
                        },
                    },
                },
            }
        ]);

        return res.status(200).json({
            error: false,
            results: results.length > 0 ? results[0] : { data: [], count: 0 },
            message: ""
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: true,
            message: errorRespond,
            results: { data: [], count: 0 }
        });

    }

}

export const editUser = async (req: Request, res: Response): Promise<Response> => {
    const center_id: string = res.locals.user.center_id._id;
    const user_id: string = req.body.user_id;
    const name: string = req.body.name;
    const email: string = req.body.email;
    const phone: string = req.body.phone;
    const password: string = req.body.password;
    const actions: string[] = req.body.actions;
    const address: string = req.body.address;

    if (await isEmailExistExceptThisId({ email, id: user_id, center_id })) {
        return res.status(500).json({
            error: true,
            message: errorEmailExistsRespond,
        });
    }

    try {
        const results = await AccountSchema.updateOne({
            _id: new ObjectId(user_id),
            center_id: new ObjectId(center_id),
            type: "assistance",
        }, {
            name,
            email,
            phone,
            password,
            privileges: {
                actions,
            },
            address,
        });

        if (results.modifiedCount === 0) {
            return res.status(500).json({
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
            results: error
        });

    }
}

export const removeUser = async (req: Request, res: Response): Promise<Response> => {
    const user_id: string = req.params.user_id;

    try {
        const results = await AccountSchema.updateOne({
            _id: new ObjectId(user_id),
            type: "assistance",
        }, {
            is_deleted: true
        });

        if (results.modifiedCount === 0) {
            return res.status(500).json({
                error: true,
                message: errorSuccessRemovingRespond,
            });
        } else {
            return res.status(200).json({
                error: false,
                message: successRemovingRespond,
            });
        }
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: true,
            message: errorRespond,
            results: error
        });

    }
}