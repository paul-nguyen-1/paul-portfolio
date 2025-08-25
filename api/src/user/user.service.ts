import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as firebaseAdmin from 'firebase-admin';
import { LoginDto } from './dto/login.dto';
import axios, { AxiosResponse } from 'axios';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export interface FirebaseResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async createUser(body: CreateUserDto): Promise<User> {
    try {
      const userRecord = await firebaseAdmin.auth().createUser({
        displayName: body.firstName + ' ' + body.lastName,
        email: body.email.toLowerCase(),
        password: body.password,
      });

      const newUser = new this.userModel({
        _id: uuidv4(),
        firstName: body.firstName,
        lastName: body.lastName,
        timestamp: new Date(),
      });

      return await newUser.save();
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      throw new Error('User registration failed');
    }
  }

  async loginUser(payload: LoginDto): Promise<FirebaseResponse> {
    const { email, password } = payload;
    try {
      const { idToken, refreshToken, expiresIn } =
        await this.signInWithEmailAndPassword(email, password);
      return { idToken, refreshToken, expiresIn };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
      ) {
        const message = error.message;
        if (message.includes('EMAIL_NOT_FOUND')) {
          throw new Error('User not found.');
        } else if (message.includes('INVALID_PASSWORD')) {
          throw new Error('Invalid password.');
        } else {
          throw new Error(message);
        }
      } else {
        throw new Error('Login failed.');
      }
    }
  }

  private async signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<FirebaseResponse> {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;
    return await this.sendPostRequest<FirebaseResponse>(url, {
      email,
      password,
      returnSecureToken: true,
    });
  }

  private async sendPostRequest<T>(
    url: string,
    data: Record<string, unknown>,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post<T>(url, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Request failed:', error);
      throw new Error('Request failed');
    }
  }

  async refreshAuthToken(refreshToken: string): Promise<FirebaseResponse> {
    try {
      const raw = await this.sendRefreshAuthTokenRequest(refreshToken);
      const idToken = raw.id_token;
      const newRefreshToken = raw.refresh_token;
      const expiresIn = raw.expires_in;

      return {
        idToken,
        refreshToken: newRefreshToken,
        expiresIn,
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
      ) {
        const message = error.message;
        if (message.includes('INVALID_REFRESH_TOKEN')) {
          throw new Error(`Invalid refresh token: ${refreshToken}.`);
        } else {
          throw new Error('Failed to refresh token');
        }
      } else {
        throw new Error('Token refresh failed.');
      }
    }
  }

  private async sendRefreshAuthTokenRequest(refreshToken: string): Promise<{
    id_token: string;
    refresh_token: string;
    expires_in: string;
  }> {
    const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`;
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    return await this.sendPostRequest(url, payload);
  }

  async validateRequest(req: Request): Promise<DecodedIdToken | null> {
    const authHeader = req.headers['authorization'];
    if (typeof authHeader !== 'string') {
      return null;
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return null;
    }

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      {
        return decodedToken;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }
}
