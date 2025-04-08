import dotenv from 'dotenv';
dotenv.config();
const isProd = process.env.NODE_ENV === 'production';
console.log('cookie.js');
console.log(process.env.NODE_ENV);
console.log(isProd);
export const cookieConfig = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'None' : 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
