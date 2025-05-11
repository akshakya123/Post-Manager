const dotenv=require('dotenv');

dotenv.config();

module.exports={
    PORT:process.env.PORT || 4444,
    SECRET_KEY:process.env.SECRET_KEY || 'mysecretkey',
    SALT:process.env.SALT || 5,
}