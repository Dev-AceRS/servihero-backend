import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailerService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(EmailerService.name);

  async inviteUser(email: string, access_token: string): Promise<any> {
    const link = `https://example.com/invitation?token=${access_token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `You are invited testing`,
        html: `Hello, <br><br> You are invited to join our platform. Please click on the link below to accept your invitation: <br><a href="${link}">Accept Invitation</a><br><br> If you did not request this invitation, please ignore this email.`,
      });
    } catch (error) {
      const errorMessage = 'Error Sending invite';

      this.logger.error(errorMessage, error);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async sendOTP(email: string, otp: string): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Your OTP Code`,
        html: `Your OTP code is ${otp}`,
      });
    } catch (error) {
      const errorMessage = 'Error Sending code';

      this.logger.error(errorMessage, error);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async forgotPassword(email: string, access_token: string): Promise<any> {
    const link = `https://example.com/forgot-password?token=${access_token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Reset your Password`,
        html: `We received a request to reset the password for your account. To proceed with the password reset, please follow the link below:: <br><a href="${link}">Password Reset</a><br><br> If you did not request this change, you can safely ignore this email. Your password will remain unchanged.<br> Thank you.`,
      });
    } catch (error) {
      const errorMessage = 'Error Sending invite';

      this.logger.error(errorMessage, error);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
