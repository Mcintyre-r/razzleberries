import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

const passwordHash = Buffer.from(process.env.APH || '', 'base64').toString();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!passwordHash) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const isValid = await compare(password, passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = sign({ role: 'admin' }, JWT_SECRET as string, { expiresIn: '1h' });

    const response = NextResponse.json({ success: true });
    
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',  
      maxAge: 3600
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error, message: 'Authentication failed' },
      { status: 500 }
    );
  }
} 