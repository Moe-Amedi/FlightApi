export interface Account {
    _id: string;
    name: string;
    email: string | null;
    phone: string | null;
    password: string;
    password_show: string;
    address: string | null;
    type: AccountType;
    privileges: AccountPrivilege;
    center_id: string;
    auth: AccountAuth[];
    is_deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type AccountAuth = {
    _id: string;
    auth_token: string;
    auth_phone_details: string;
    auth_ip?: string;
    auth_city?: string;
    auth_lat?: string;
    auth_lon?: string;
    auth_phone_id: string;
    auth_firebase: string;
};

export type AccountType = 'super_admin' | 'admin' | 'assistance' | 'customer';

export type AccountPrivilege = {
    action: "add" | "edit" | "remove";
}

