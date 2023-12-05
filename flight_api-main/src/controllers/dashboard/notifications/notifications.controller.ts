import { Request, Response } from "express";
import { content_url } from "../../../constants/static_url";
import NotificationsSchema from "../../../models/notifications";
import { errorRespond, errorSuccessRemovingRespond, successAddingRespond, successRemovingRespond } from "../../../constants/responses/responses";
import { ISortBy } from "../../../interface/sortBy.interface.";
import { web_sort_condition } from "../../../constants/dashboard";
import mongoose from "mongoose";
import { convertBase64ToImage } from "../../../constants/base64ToImage";
const ObjectId = mongoose.Types.ObjectId;


export const addNotification = async (req: Request, res: Response): Promise<Response> => {
    const title: string = req.body.title;
    const body: string = req.body.body;
    const type: string = "اشعار";
    const receiver_type: string = "جميع الزبائن";
    const image: string | null = req.body.image ?
        convertBase64ToImage(req.body.image) : null;

    const center_id: string = res.locals.user.center_id._id;


    try {
        const notification = new NotificationsSchema({
            title,
            body,
            type,
            image,
            receiver_type,
            center_id
        });

        await notification.save();

        return res.status(200).json({
            error: false,
            message: successAddingRespond,
            results: notification
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

export const getNotifications = async (req: Request, res: Response): Promise<Response> => {
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
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    body: {
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
        const results = await NotificationsSchema.aggregate([
            {
                $facet: {
                    data: [
                        main_match,
                        {
                            $match: search_condition,
                        },
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
            message: "",
            results: results.length > 0 ? results[0] : { data: [], count: 0 },
            content_url
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: true,
            message: errorRespond,
            results: { data: [], count: 0 },
            content_url
        });

    }

}

export const removeNotification = async (req: Request, res: Response): Promise<Response> => {
    const notification_id: string = req.params.notification_id;

    try {
        const results = await NotificationsSchema.deleteOne({ _id: new ObjectId(notification_id) });

        if (results.deletedCount == 0) {
            return res.status(200).json({
                error: true,
                message: errorSuccessRemovingRespond,
                results: {}
            });
        } else {
            return res.status(200).json({
                error: false,
                message: successRemovingRespond,
                results: {}
            });
        }



    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: true,
            message: errorRespond,
            results: {}
        });

    }

}

