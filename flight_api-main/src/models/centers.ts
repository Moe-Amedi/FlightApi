import mongoose from 'mongoose';
// centers schema  model

const centersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: false,
        default: null
    },
}, {
    timestamps: true
});

const CentersSchema = mongoose.model('centers', centersSchema);

export default CentersSchema;
