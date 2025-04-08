export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // ✅
  sameSite: 'None', // ✅ Case-sensitive
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
