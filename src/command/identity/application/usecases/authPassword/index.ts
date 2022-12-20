import { LoginController } from './LoginController';
import { LoginUseCase } from './LoginUseCase';
import { UserModel } from '../../../infra/database/UserModel';
import { UserRepo } from '../../../infra/repo/UserRepo';
import { PasswordAuthModel } from '../../../infra/database/PasswordAuthModel';
import { LineAuthModel } from '../../../infra/database/LineAuthModel';
import { AppleAuthModel } from '../../../infra/database/AppleAuthModel';
import { DeviceAuthModel } from '../../../infra/database/DeviceAuthModel';
import { EmailCertificationModel } from '../../../infra/database/EmailCertificationModel';
import { PhoneCertificationModel } from '../../../infra/database/PhoneCertificationModel';
import { RealNameCertificationModel } from '../../../infra/database/RealNameCertificationModel';
import { FacebookAuthModel } from '../../../infra/database/FacebookAuthModel';
import { GoogleAuthModel } from '../../../infra/database/GoogleAuthModel';

const userModel = new UserModel();
const lineAuthModel = new LineAuthModel();
const passwordAuthModel = new PasswordAuthModel();
const appleAuthModel = new AppleAuthModel();
const deviceAuthModel = new DeviceAuthModel();
const googleAuthModel = new GoogleAuthModel();
const facebookAuthModel = new FacebookAuthModel();
const emailCertificationModel = new EmailCertificationModel();
const phoneCertificationModel = new PhoneCertificationModel();
const realNameCertificationModel = new RealNameCertificationModel();
const userRepo = new UserRepo(userModel, passwordAuthModel, lineAuthModel, appleAuthModel, deviceAuthModel, googleAuthModel, facebookAuthModel, emailCertificationModel, phoneCertificationModel, realNameCertificationModel);

const loginUseCase = new LoginUseCase(userRepo);
const loginController = new LoginController(loginUseCase);

export { loginController };
