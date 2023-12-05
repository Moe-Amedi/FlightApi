import mongoose, { Schema } from 'mongoose';
// account schema model

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: false,
        default: null
    },

    password: {
        type: String,
        required: true,
    },

    password_show: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: false,
        default: null
    },

    address: {
        type: String,
        required: false,
        default: null
    },

    type: {
        type: String,
        enum: ['super_admin', 'admin', 'assistance', 'customer'],
        required: false,
        default: null
    },

    privileges: {
        // default: ['add', 'edit', 'remove'],
        actions: {
            type: Array,
            required: false,
            default: ['add', 'edit', 'remove']
        },
    },

    center_id: {
        type: Schema.Types.ObjectId,
        ref: 'centers',
        required: true,
    },

    auth: [
        {
            auth_token: {
                type: String,
                required: true,
                default: null,
            },
            auth_phone_details: {
                type: String,
                required: false,
                default: null,
            },
            auth_ip: {
                type: String,
                required: false,
                default: null,
            },
            auth_city: {
                type: String,
                required: false,
                default: null,
            },
            auth_lat: {
                type: String,
                required: false,
                default: null,
            },
            auth_lon: {
                type: String,
                required: false,
                default: null,
            },
            auth_phone_id: {
                type: String,
                required: false,
                default: null,
            },
            auth_firebase: {
                type: String,
                required: false,
                default: null,
            },
        },
    ],

    is_deleted: {
        type: Boolean,
        required: false,
        default: false
    },

}, {
    timestamps: true
});

const AccountSchema = mongoose.model('accounts', accountSchema);

export default AccountSchema;