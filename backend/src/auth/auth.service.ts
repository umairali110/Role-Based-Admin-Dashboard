import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException,InternalServerErrorException,BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepo: Repository<Auth>,
    private jwtService:JwtService,
  ) {}

  private async sendOtpEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is: ${otp}`,
  });
}

async login(data: any) {
  try {
    const user = await this.authRepo.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify OTP first');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Login successful',
      token,
    };

  } catch (error) {
    throw new InternalServerErrorException("login Failed");
  }
}
async register(data: any) {
  const existingUser = await this.authRepo.findOne({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new BadRequestException('User already exists');
  }

  const hashed = await bcrypt.hash(data.password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const user = await this.authRepo.save({
    email: data.email,
    password: hashed,
    role: data.role || "user",
    isVerified: false,
    otp: otp,
    otpExpires: new Date(Date.now() + 5 * 60 * 1000),
  });
  try {
  await this.sendOtpEmail(data.email, otp);
} catch (err) {
  console.log("EMAIL ERROR:", err);
}

  // 3. SEND EMAIL
  await this.sendOtpEmail(data.email, otp);

  return {
    message: "User registered. OTP sent to email",
  };
}
async verifyOtp(email: string, otp: string) {
  const user = await this.authRepo.findOne({
    where: { email },
  });

  if (!user) throw new BadRequestException("User not found");

  if (user.otp !== otp) {
    throw new BadRequestException("Invalid OTP");
  }

  if (!user.otpExpires || user.otpExpires < new Date()) {
  throw new BadRequestException("OTP expired");
}

  user.isVerified = true;
  user.otp = null;

  return this.authRepo.save(user);
}
}