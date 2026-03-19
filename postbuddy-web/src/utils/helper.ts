import { jwtDecode } from 'jwt-decode';

interface Decode {
  email: string;
  fullName: string;
  _id: string;
  profileUrl: string
}

export function   getAuth(): { email: string; fullName: string; _id: string; profileUrl: string } | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const decoded: Decode = jwtDecode(token);

    return { email: decoded.email, fullName: decoded.fullName, _id: decoded._id, profileUrl: decoded.profileUrl };
  } catch (error) {
    return null;
  }
}

export function isAuth(): boolean {
  const auth = getAuth()?._id; 
  console.log('Auth ==> ',auth)
  return !auth;
}
