import {
    deletedAccountRespond,
    errorRespond,
    wrongEmailOrPasswordRespond,
} from "./../../../constants/responses/responses";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AccountSchema from "../../../models/accounts";
import { Account, AccountPrivilege } from "../../../interface/account.interface";
import { content_url } from "../../../constants/static_url";

class Login {
    constructor() {
        this.login = this.login.bind(this);
    }
    public async login(req: Request, res: Response) {
        const email: string = req.body.email;
        const password: string = req.body.password;
        const auth_phone_details: string = req.body.auth_phone_details;
        const auth_ip: string = req.body.auth_ip;
        const auth_city: string = req.body.auth_city;
        const auth_lat: string = req.body.auth_lat;
        const auth_lon: string = req.body.auth_lon;
        const auth_phone_id: string = req.body.auth_phone_id;
        const auth_firebase: string = req.body.auth_firebase;


        try {
            const account: Account | null = await this.getAccountFromDB(
                email,
                password
            );

            if (account) {
                if (account.is_deleted === false) {
                    const accessToken: string = this.signTokenInJwt({
                        _id: account._id,
                        name: account.name,
                        email: account.email,
                        phone: account.phone,
                        type: account.type,
                        privileges: account.privileges,
                        center_id: account.center_id,
                    });

                    res.json({
                        results: {
                            token: accessToken,
                            _id: account._id,
                            name: account.name,
                            email: account.email,
                            phone: account.phone,
                            address: account.address,
                            type: account.type,
                            privileges: account.privileges,
                            center_id: account.center_id,
                            content_url,
                        },
                        error: false,
                    });

                    this.insertAuth(
                        account,
                        accessToken,
                        auth_phone_details,
                        auth_ip,
                        auth_city,
                        auth_lat,
                        auth_lon,
                        auth_phone_id,
                        auth_firebase
                    );

                } else {
                    return res.status(500).json({
                        error: true,
                        results: deletedAccountRespond,
                    });
                }
            } else {
                return res.status(500).json({
                    error: true,
                    results: wrongEmailOrPasswordRespond,
                });
            }
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                error: true,
                results: errorRespond,
            });
        }
    }

    private async getAccountFromDB(
        email: string,
        password: string
    ): Promise<Account | null> {

        try {
            var resultsDB: Account[] = await AccountSchema.aggregate([
                {
                    $match: {
                        email,
                        password,
                    },
                },
                {
                    $lookup: {
                        from: "centers",
                        localField: "center_id",
                        foreignField: "_id",
                        as: "center",
                    },
                },

                {
                    $addFields: {
                        center_id: {
                            $first: "$center",
                        },
                    },
                },

                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        phone: 1,
                        address: 1,
                        type: 1,
                        privileges: 1,
                        center_id: 1,
                        is_deleted: 1,
                    },
                },
            ]);

            return resultsDB.length > 0 ? resultsDB[0] : null;
        } catch (e) {
            console.log(e);

            return null;
        }
    }

    private signTokenInJwt(data: {
        _id: string,
        name: string,
        email: string | null,
        phone: string | null,
        type: string,
        privileges: AccountPrivilege,
        center_id: string,
    }) {
        const accessToken = jwt.sign(data,
            process.env.ACCESS_TOKEN_SECRET!
        );

        return accessToken;
    }

    private async insertAuth(
        account: Account,
        auth_token: string,
        auth_phone_details: string,
        auth_ip: string,
        auth_city: string,
        auth_lat: string,
        auth_lon: string,
        auth_phone_id: string,
        auth_firebase: string
    ): Promise<void> {

        await this.insertAuthInDB(
            account,
            auth_token,
            auth_phone_details,
            auth_ip,
            auth_city,
            auth_lat,
            auth_lon,
            auth_phone_id,
            auth_firebase
        );
    }

    private async insertAuthInDB(
        account: Account,
        auth_token: string,
        auth_phone_details: string,
        auth_ip: string,
        auth_city: string,
        auth_lat: string,
        auth_lon: string,
        auth_phone_id: string,
        auth_firebase: string
    ) {
        await AccountSchema.updateOne(
            {
                _id: account._id,
            },
            {
                $push: {
                    auth: {
                        auth_token,
                        auth_phone_details,
                        auth_ip,
                        auth_city,
                        auth_lat,
                        auth_lon,
                        auth_phone_id,
                        auth_firebase,
                    },
                },
            }
        );
    }
}

export default new Login();
