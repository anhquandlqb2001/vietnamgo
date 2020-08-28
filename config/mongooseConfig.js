const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log("Connected to database");
  } catch (error) {
    console.log("Connect to database failue", error);
  }
}

module.exports = { connect };
