const app = require('./app');
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PORT = process.env.PORT || 8081;

const connectMongo = async () => {
  mongoose
    .connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      app.listen(PORT, (err) => {
        if (err) {
          console.log('Error ', err);
        }
        console.log(`Server is running. Use our API on port: ${PORT}`);
      });
      console.log('Database connection successful');
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

const start = async () => {
  await connectMongo();
};
start();
