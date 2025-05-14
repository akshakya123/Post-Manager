const dotenv=require('dotenv');

dotenv.config();

module.exports={
    PORT:process.env.PORT || 8000,
    SECRET_KEY:process.env.SECRET_KEY || 'mysecretkey',
    SALT:process.env.SALT || 5,
    PLATFORM:process.env.PLATFORM || 'Node.JS'
}