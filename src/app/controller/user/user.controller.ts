import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  Res,
  StreamableFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiQueryOptions,
  ApiConsumes,
} from '@nestjs/swagger';
import {
  UserRegisterDTO,
  UserInfoDTO,
  InviteUserDTO,
  InvitedUserRegistrationDTO,
  ProfileImageType,
  ResetPasswordDto,
} from 'src/app/dto/user';
import { AbstractUserService, ProfileImages } from 'src/app/interface/user';
import { Public } from '../../decorators/public.decorator';
import { FileUpload } from 'src/app/models/file-upload/file-upload.schema';
import { FileUploadPipe } from 'src/app/pipes/file-upload.pipe';
import { Response } from 'express';
import { S3Service } from 'src/app/services/s3/s3.service';
import { JwtAuthGuard } from 'src/app/guard/auth';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: AbstractUserService,
    private readonly s3Service: S3Service,
  ) {}
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  async createUser(@Body() userRegisterDto: UserRegisterDTO): Promise<any> {
    return this.userService.createUser(userRegisterDto);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiQuery({
    name: 'email',
    required: true,
  } as ApiQueryOptions)
  async forgotPassword(@Query('email') email: string): Promise<any> {
    return this.userService.forgotPassword(email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Reset Password' })
  async resetPassword(
    @Req() request,
    @Body() resetPasswordDTO: ResetPasswordDto,
  ): Promise<any> {
    return this.userService.resetPassword(request, resetPasswordDTO);
  }

  @Public()
  @Post('send-register-otp')
  @ApiOperation({ summary: 'One Time Password' })
  @ApiQuery({
    name: 'email',
    required: true,
  } as ApiQueryOptions)
  async sendOTP(@Query('email') email: string): Promise<any> {
    return await this.userService.sendOTP(email);
  }

  @Public()
  @Post('verify-otp')
  @ApiOperation({ summary: 'One Time Password' })
  @ApiQuery({
    name: 'email',
    required: true,
  } as ApiQueryOptions)
  @ApiQuery({
    name: 'otp',
    required: true,
  } as ApiQueryOptions)
  async verifyOTP(
    @Query('email') email: string,
    @Query('otp') otp: string,
  ): Promise<any> {
    return await this.userService.verifyOTP(email, otp);
  }

  @UseGuards(JwtAuthGuard)
  @Post('user-info')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Create user info' })
  async createUserInfo(@Body() userInfoDTO: UserInfoDTO): Promise<any> {
    return this.userService.createUserInfo(userInfoDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get User Profile' })
  async profile(): Promise<any> {
    return this.userService.profile();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get User Profile' })
  async getUser(@Param('id') id: string): Promise<any> {
    return this.userService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('invite-user')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Invite User' })
  async inviteUser(@Body() inviteUserDTO: InviteUserDTO): Promise<any> {
    return this.userService.inviteUser(inviteUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel-invited-user')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Cancel Invited User' })
  @ApiQuery({
    name: 'email',
    required: true,
  } as ApiQueryOptions)
  async cancelInviteUser(@Query('email') email: string): Promise<any> {
    return this.userService.cancelInviteUser(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-invited-user')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Get Invite User' })
  async getInviteUser(): Promise<any> {
    return this.userService.getInvitedUser();
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate-invite-user')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Invite User' })
  async validateInviteUser(@Body() inviteUserDTO: InviteUserDTO): Promise<any> {
    return this.userService.validateInviteUser(inviteUserDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Post('invited-user/register')
  @ApiBearerAuth('Bearer')
  @ApiOperation({ summary: 'Invited User Registration' })
  async invitedUserRegistration(
    @Body() invitedUserRegistrationDTO: InvitedUserRegistrationDTO,
  ): Promise<any> {
    return this.userService.invitedUserRegistration(invitedUserRegistrationDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-profile')
  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'Update service document upload in vendor accreditation request',
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image_1' }]))
  @ApiConsumes('multipart/form-data')
  async updateUserProfile(
    @UploadedFiles(FileUploadPipe) files: ProfileImages,
    @Query('id') userInfoId?: string,
  ) {
    if (!userInfoId) userInfoId = '';

    return await this.userService.uploadProfile(files, userInfoId);
  }

  @Public()
  @Get('images/:id/image/:path(*)')
  @ApiOperation({ summary: 'Get catalog item default image' })
  async getProfile(
    @Param('id') id: string,
    @Param('path') path: string,
    @Res({ passthrough: true }) res: Response,
    @Query() { type }: ProfileImageType,
  ): Promise<StreamableFile | void> {
    return await this.userService.getProfile(id, path, res, type);
  }
}
