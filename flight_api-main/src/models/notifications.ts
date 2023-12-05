import mongoose from "mongoose";
// notifications schema  model

const notificationsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: false,
        default: null
    },

    image: {
        type: String,
        required: false,
        default: null
    },

    type: {
        type: String,
        enum: ['اشعار', 'حجز', 'تسجل زبون جديد'],
        required: false,
        default: null
    },

    receiver_type: {
        type: String,
        enum: ['جميع الزبائن', 'داشبورد'],
        required: false,
        default: null
    },

    center_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'centers',
        required: true
    },
}, {
    timestamps: true
});


const NotificationsSchema = mongoose.model('notifications', notificationsSchema);

export default NotificationsSchema;