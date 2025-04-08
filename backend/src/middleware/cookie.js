export const cookieConfig = {
  httpOnly: true,
  // In production you’ll likely need secure cookies and sameSite 'none' (if different domains are involved)
  secure: false,
  // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  sameSite: 'None',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
// export const cookieConfig = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production',
//   sameSite: 'strict',
//   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
// };
