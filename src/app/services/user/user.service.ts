import {
  Injectable,
  Inject,
  UnauthorizedException,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as _ from 'lodash';
import {
  UserRegisterDTO,
  UserInfoDTO,
  InviteUserDTO,
  InvitedUserRegistrationDTO,
  ResetPasswordDto,
  ChangePasswordDto,
  CreatePasswordDto,
} from 'src/app/dto/user';
import { AbstractUserService, ProfileImages } from 'src/app/interface/user';
import { AbstractUserRepository } from 'src/app/interface/user';
import { User, UserDocument } from 'src/app/models/user/user.schema';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import {
  UserInfo,
  UserInfoDocument,
} from 'src/app/models/user/user-info.schema';
import { Response } from 'express';
@Injectable()
export class UserService implements AbstractUserService {
  constructor(
    private readonly repository: AbstractUserRepository,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(REQUEST) private readonly request: Request,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
  ) {}

  async createUser(userRegisterDto: UserRegisterDTO): Promise<any> {
    return await this.repository.createUser(userRegisterDto);
  }
  async changePassword(changePasswordDto: ChangePasswordDto): Promise<any> {
    return await this.repository.changePassword(changePasswordDto);
  }
  async createPassword(createPasswordDto: CreatePasswordDto): Promise<any> {
    return await this.repository.createPassword(createPasswordDto);
  }
  async createUserInfo(userInfoDTO: UserInfoDTO): Promise<any> {
    return await this.repository.createUserInfo(userInfoDTO);
  }

  async profile(): Promise<any> {
    const user = this.request.user as Partial<User> & { sub: string };
    return await this.repository.profile(user);
  }
  async getUser(id: string): Promise<any> {
    return await this.repository.getUser(id);
  }

  async getUserByEmail(email: string): Promise<any> {
    return await this.repository.getUserByEmail(email);
  }
  async getInvitedUser(): Promise<any> {
    return await this.repository.getInvitedUser();
  }
  async getAcceptedInvitedUser(): Promise<any> {
    return await this.repository.getAcceptedInvitedUser();
  }
  async findByUserId(userId: string) {
    const userInfo = await this.userInfoModel.findOne({ user_id: userId });
    return userInfo;
  }
  async inviteUser(inviteUserDTO: InviteUserDTO): Promise<any> {
    return await this.repository.inviteUser(inviteUserDTO);
  }

  async cancelInviteUser(email: string): Promise<any> {
    return await this.repository.cancelInviteUser(email);
  }

  async validateInviteUser(inviteUserDTO: InviteUserDTO): Promise<any> {
    return await this.repository.validateInviteUser(inviteUserDTO);
  }

  async updateUserStripeId(stripeId: string, userId: string): Promise<any> {
    return await this.repository.updateUserStripeId(stripeId, userId);
  }

  async updateWeatherInfoId(
    weatherforecast_id: string,
    userId: string,
  ): Promise<any> {
    return this.repository.updateWeatherInfoId(weatherforecast_id, userId);
  }

  async invitedUserRegistration(
    invitedUserRegistrationDTO: InvitedUserRegistrationDTO,
    token: string,
  ): Promise<any> {
    return await this.repository.invitedUserRegistration(
      invitedUserRegistrationDTO,
      token,
    );
  }

  async sendOTP(email: string): Promise<any> {
    return this.repository.sendOTP(email);
  }
  async verifyOTP(email: string, otp: string): Promise<any> {
    return this.repository.verifyOTP(email, otp);
  }
  async uploadProfile(files: ProfileImages, userInfoId: string): Promise<any> {
    return this.repository.uploadProfile(files, userInfoId);
  }
  async userData(id: string): Promise<any> {
    return this.repository.userData(id);
  }
  async getProfile(
    id: string,
    path: string,
    res: Response,
    type: string,
  ): Promise<void | StreamableFile> {
    return this.repository.getProfile(id, path, res, type);
  }
  async forgotPassword(email: string): Promise<any> {
    return this.repository.forgotPassword(email);
  }
  async resetPassword(
    token: string,
    resetPasswordDTO: ResetPasswordDto,
  ): Promise<any> {
    return this.repository.resetPassword(token, resetPasswordDTO);
  }
  async getMember(): Promise<any> {
    return this.repository.getMember();
  }
  async getAllUsers(): Promise<any> {
    return this.repository.getAllUsers();
  }
}
