import { Request, Response } from "express";
import { errorRespond } from "../../../constants/responses/responses";
import AccountSchema from "../../../models/accounts";
import mongoose from "mongoose";
import OtpSchema from "../../../models/otp";
import { ISortBy } from "../../../interface/sortBy.interface.";
import { web_sort_condition } from "../../../constants/dashboard";
const ObjectId = mongoose.Types.ObjectId;

export const getCustomers = async (req: Request, res: Response) => {
    const center_id: string = res.locals.user.center_id._id;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip: number = (page - 1) * limit;
    const search: string | null = req.query.search as string || null;

    const sortBy: ISortBy[] = req.query.sortBy ? JSON.parse(req.query.sortBy as string) : [];

    let sort_condition: any = web_sort_condition(sortBy);

    const search_query = search ?
        {
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
            ],
        } : {}

    const main_match = {
        $match: {
            center_id: new ObjectId(center_id),
        },
    };

    try {
        const results = await AccountSchema.aggregate([
            {
                $facet: {
                    data: [
                        main_match,
                        {
                            $match: search_query,
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
                        main_match,
                        {
                            $match: search_query,
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
            message: "تم جلب البيانات بنجاح",
            results: results.length > 0 ? results[0] : { data: [], count: 0 }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: true,
            message: errorRespond,
        });

    }
}

export const getOtps = async (req: Request, res: Response) => {
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
                    otp: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    "$account_info.phone": {
                        $regex: search,
                        $options: "i",
                    },
                },

                {
                    "$account_info.name": {
                        $regex: search,
                        $options: "i",
                    },
                },
            ],

        };
    }

    const main_match = {
        $match: {
            center_id: new ObjectId(center_id),
        },
    };

    try {

        const results = await OtpSchema.aggregate([
            {
                $facet: {
                    data: [
                        main_match,
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
                        main_match,
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
            message: "تم جلب البيانات بنجاح",
            results: results.length > 0 ? results[0] : { data: [], count: 0 }
        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: true,
            message: errorRespond,
        });

    }

}