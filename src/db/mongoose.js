import mongoose from 'mongoose';


try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to the database");

} catch (e) {
  console.log("Error connecting to the database. \n" + e);
  throw Error('Got an error trying to connect to the database.');
}
