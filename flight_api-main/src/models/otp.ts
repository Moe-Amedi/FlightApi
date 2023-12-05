import mongoose from "mongoose";


const otpSchema = new mongoose.Schema({
    account_info: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'accounts',
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },
    },

    otp: {
        type: String,
        required: true,
    },

    sender_type: {
        type: String,
        required: false,
        enum: ['whatsapp', 'sms'],
        default: 'sms'
    },

    is_deleted: {
        type: Boolean,
        required: false,
        default: false
    },

    center_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'centers',
        required: true
    },

}, {
    timestamps: true
});


const OtpSchema = mongoose.model('otp', otpSchema);

export default OtpSchema;