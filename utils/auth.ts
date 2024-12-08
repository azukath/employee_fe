import { GetServerSidePropsContext } from 'next';

export function checkToken(context: GetServerSidePropsContext): string | null {
  const { req } = context;
  const token = req.cookies.token || null; // Assuming the token is stored in cookies

  return token;
}
