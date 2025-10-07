import mongoose from 'mongoose';


console.log(`Environment: ${process.env.MONGODB_URL}`);
try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to the database");

} catch (e) {
  console.log("Error connecting to the database. \n" + e);
  throw Error('Got an error trying to connect to the database.');
}
