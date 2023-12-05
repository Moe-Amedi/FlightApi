import { Request, Response } from "express";
import CentersSchema from "../../../models/centers";
import { errorRespond, errorSuccessEditingRespond, errorSuccessRemovingRespond, successAddingRespond, successEditingRespond, successRemovingRespond } from "../../../constants/responses/responses";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;


export const getCenters = async (req: Request, res: Response): Promise<Response> => {
    try {
        const centers = await CentersSchema.find();

        return res.status(200).json({
            error: false,
            message: "Centers fetched successfully",
            results: centers
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: true,
            message: "Error while fetching centers",
            results: []
        });

    }
}

export const addCenter = async (req: Request, res: Response): Promise<Response> => {
    const name: string = req.body.name;
    const address: string = req.body.address;
    const phone: string | null = req.body.phone;

    try {
        const center = await CentersSchema.create({
            name,
            address,
            phone
        });

        return res.status(200).json({
            error: false,
            message: successAddingRespond,
            results: center
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

export const editCenter = async (req: Request, res: Response): Promise<Response> => {
    const center_id: string = req.body.center_id;
    const name: string = req.body.name;
    const address: string = req.body.address;
    const phone: string | null = req.body.phone;

    try {
        const center = await CentersSchema.updateOne({ _id: center_id }, {
            name,
            address,
            phone
        });

        if (center.modifiedCount == 0) {
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
            results: {}
        });

    }
}

export const removeCenter = async (req: Request, res: Response): Promise<Response> => {
    const center_id: string = req.params.center_id;

    try {
        const center = await CentersSchema.deleteOne({ _id: new ObjectId(center_id) });

        if (center.deletedCount == 0) {
            return res.status(200).json({
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
            results: {}
        });

    }
}