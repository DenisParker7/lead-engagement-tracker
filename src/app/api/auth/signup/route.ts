import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password, companyName } = await request.json();

    // Validate input
    if (!name || !email || !password || !companyName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create company first
    const company = await prisma.company.create({
      data: {
        name: companyName,
        domain: email.split('@')[1], // Simple domain extraction from email
      },
    });

    // Create user with company
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        companyId: company.id,
      },
    });

    // Create default settings for the company
    await prisma.settings.create({
      data: {
        companyId: company.id,
      },
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
} 