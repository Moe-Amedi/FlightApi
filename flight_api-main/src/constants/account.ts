import AccountSchema from "../models/accounts";


export const isEmailExist = async (data: { email: string, center_id: string }): Promise<boolean> => {
    const results = await AccountSchema.findOne({ email: data.email, center_id: data.center_id });

    return results ? true : false;
}

export const isEmailExistExceptThisId = async (data: { email: string, id: string, center_id: string }): Promise<boolean> => {
    const results = await AccountSchema.findOne({ email: data.email, _id: { $ne: data.id } });

    return results ? true : false;
}

export const isPhoneExist = async (data: { phone: string, center_id: string }): Promise<boolean> => {
    const results = await AccountSchema.findOne({ phone: data.phone, center_id: data.center_id });

    return results ? true : false;
}


