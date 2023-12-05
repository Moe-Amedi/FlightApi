import mongoose from 'mongoose';
require('dotenv').config();

const { MONGO_URL_local } = process.env;

export async function mongooseConnect() {
  await mongoose
    .connect(MONGO_URL_local!)
    .then((res) => {
      console.log(
        "Connected Database",
      );
    })
    .catch((err) => {
      console.log(
        `error Database -`,
        err,
      );
    });
}


