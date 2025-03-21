const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const crypto = require("crypto");
const { Op } = Sequelize;
const config = require("../../../config/config");
const { tokenTypes } = require("../../../config/token");
const { tokenService } = require("../../../services");
const db = require("../../../models");
const ApiError = require("../../../utils/ApiError");
// const { INMEMORY_PREFIX_KEY } = require("../../../utils/constants");
const userDeviceService = require("../../../services/userDevice.service");

const { sendOtpEmail } = require("../../../services/email.service");
const { sendWelcomeMail } = require("../../../services/email.service");
const moment = require("moment");
const { error } = require("console");

const invitees=db.invitees;
const User = db.user;
const Token = db.token;
const Userdevice = db.userDevice;

/**
 * @description Get user by email
 * @param {String} email - contains email
 * @returns {JSON} user data
 */
const getByEmail = async (email) => {
  const user = await User.findOne({
    where: { email: email,is_active:1 } },
  );
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email");
  return user.dataValues;
};

/**
 * @description Get user by id
 * @param {String} id - contains user id
 * @returns {JSON} user data
 */
const getById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  return user.dataValues;
};

/**
 * @description Check password
 * @param {String} password - contains password
 * @returns {Boolean} password correct or not flag
 */
const checkPassword = async (actualPassword, payloadPassword) => {
  const isCorrectPassword = await bcrypt.compare(
    payloadPassword,
    actualPassword
  );
  return isCorrectPassword;
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @param {number} user_type
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password, userType) => {
  const user = await getByEmail(email);
  if (!user.is_email_verified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email ID not verified");
  }
  if (user && !(await checkPassword(user.password, password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }
  delete user.password;
  // delete user.auth_code;
  return user;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await getById(refreshTokenDoc.user_id);
    if (!user) {
      throw new Error();
    }
    if (refreshTokenDoc.token === refreshToken) {
      await Token.destroy({
        where: {
          type: refreshTokenDoc.type,
          user_id: refreshTokenDoc.user_id,
          device_type: refreshTokenDoc.device_type,
          device_id: refreshTokenDoc.device_id
        },
      });
      return tokenService.generateAuthTokens(user, refreshTokenDoc.device_type, refreshTokenDoc.device_id);
    }
    throw new Error();
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */

const resetPassword = async (req) => {
  const user = await User.findOne({
    where: { email: { [Op.eq]: `${req.body.email}` } },
  });
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email");
  if (req.body.newPassword !== req.body.confirmNewPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "New password and confirm password does not match"
    );
  }
  const passwordCheck = await bcrypt.compare(
        req.body.newPassword,
        user.password
      );
    if (passwordCheck) {
        throw new ApiError(httpStatus.BAD_REQUEST,
            "Old password and New Password cannot be same")
     }
  await user.update({ password: req.body.newPassword });
  return {
    status: "success",
    message: "Password has been reset successfully",
  };
};

const signup = async (req,res) => {
  const emailValidation=await User.findOne({
    where: {
      email: req.Email,
      is_active:1
  }});
  if(emailValidation){
    res.status(httpStatus.BAD_REQUEST).send({'code':'400','message': 'Email is already in use','field':'Email'})
  }
  const phValidation=await User.findOne({
    where: {
      phone_number: req.PhoneNumber,
      is_active:1
  }});
  if(phValidation){
    res.status(httpStatus.BAD_REQUEST).send({'code':'400','message': 'PhoneNumber is already in use','field':'PhoneNumber'})
  }
  if(!phValidation && !emailValidation){
  const user = await User.create({
    first_name: req.FirstName,
    last_name: req.LastName,
    email: req.Email,
    phone_number: req.PhoneNumber,
    password: req.Password,
    auth_code: generateVerificationCode(),
    createdAt: new Date(),
    type:req.type
  });
  await userDeviceService.updateUserDeviceDetails(
    user.user_id,
    req.deviceId,
    req.deviceType,
    req.deviceOs,
    req.installDate,
    req.uninstallDate,
    req.appVersion
    );
  delete user.dataValues.password;
  // delete user.dataValues.auth_code;
  await sendWelcomeMail(user);
  return {
    message: "Sign up successful. Verification code sent to registered email",
    user,
  };
};
}

const generateVerificationCode = (
  length = 6,
  wishlist = '1234567890'
) =>
  Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join("");

const forgotPassword = async (req) => {
  const user = await User.findOne({
    where: { email: { [Op.like]: `%${req.email}%` } },
  });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email");
  }
  //var hours = moment.duration(moment(new Date()).diff(user.updatedAt)).hours();
  const res = await resendCode(user);
  return res;
};

const resendCode = async (user) => {
  var hours = moment(new Date()).diff(moment(user.updatedAt), "hours");
  const msg = "is your code to reset password.";
  if (user.attempts == null && user.auth_code == null) {
    const otp = generateVerificationCode();
    await user.update({
      auth_code: otp,
      attempts: 1,
      updatedAt: new Date(),
      expires_on: moment().add(10, "minutes").utc(),
    });
    sendOtpEmail(user, otp);
    return {
      status: "success",
      message: "Verification code sent to your registered email",
      attemps: 1,
    };
  } else if (user.attempts < 3 && user.auth_code != null) {
    const password_attempt = user.attempts != null ? user.attempts + 1 : 1;
    const otp = generateVerificationCode();
    await user.update({
      auth_code: otp,
      attempts: password_attempt,
      expires_on: moment().add(10, "minutes").utc(),
    });
    sendOtpEmail(user, otp, msg);
    return {
      status: "success",
      message: "Verification code sent to your registered email",
      attemps: password_attempt,
    };
  } else if (user.attempts == 3 && hours >= 6) {
    const otp = generateVerificationCode();
    await user.update({
      auth_code: otp,
      attempts: 1,
      expires_on: moment().add(10, "minutes").utc(),
    });
    sendOtpEmail(user, otp, msg);
    return {
      status: "success",
      message: "Verification code sent to your registered email",
      attemps: 1,
    };
  } else {
    await user.update({
      auth_code:""
    });
    return {
      status: "failed",
      message: "Maximum attempts exceeded. Please try after 6 hours.",
      attemps: user.attempts,
      hours: hours,
    };
  }
};
const verifyCode = async (req) => {
  const user = await User.findOne({
    where: {
      email: { [Op.eq]: `${req.email}` },
      auth_code: { [Op.eq]: `${req.auth_code}` },
    },
  });
  if (user && !user.is_email_verified && req.type == "verifyEmail") {
    const deviceType=await Userdevice.findOne({
      where: {
        user_id:user.user_id
      }
    })
    user.update({ is_email_verified: true });
    // }
    // if (user) {
    const tokens = await tokenService.generateAuthTokens(user, deviceType.device_type, deviceType.device_id);

    await Userdevice.update(
      {
        last_login: moment(new Date()).format(),
      },
      {
        where: {
          user_id: { [Op.eq]: `${user.user_id}` },
        },
      }
    );

    return {
      status: "success",
      message: "Logging in successfully",
      user: user,
      token: tokens,
    };
  }
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect Verification Code");
  }
  if (moment(new Date()).utc() < user.expires_on || user.expires_on == "") {
    await Userdevice.update(
      {
        last_login: moment(new Date()).format(),
      },
      {
        where: {
          user_id: { [Op.eq]: `${user.user_id}` },
        },
      }
    );
    return {
      status: "success",
      message: "Verified Successfully",
    };
  }
  const otp = generateVerificationCode();
  await user.update({
    expires_on: moment().add(10, "minutes").utc(),
  });
  sendOtpEmail(user, otp);
  return {
    message:
      "Verification code expired.New verification code sent to registered email_id",
  };
};
const signupCode = async (req) => {
  const user = await User.findOne({
    where: { email: { [Op.eq]: `${req.query.email}` } },
  });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email");
  }
  const res = await resendCode(user);
  return res;
};
const logOut = async (req) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      req.body.refreshToken,
      tokenTypes.REFRESH,
    );
    const user = await getById(refreshTokenDoc.user_id);
    if (!user) {
      throw new Error();
    }
    if (refreshTokenDoc.token === req.body.refreshToken) {
      let logout = await Token.destroy({
        where: {
          type: refreshTokenDoc.type,
          user_id: refreshTokenDoc.user_id,
        },
        truncate: false,
      });
      if(logout == 1){
        return {status:"success",message:"user logged out successfully"}
      }
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"+error);
  }
};

const verifyUser = async (req) => {
  // const userId=await tokenService.decodeToken(req.headers.authorization)
  const user = await User.findOne({
    where: { user_id: { [Op.eq]: `${req.query.user_id}` } },
  });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect UserId");
  }
  await User.update({is_user_verified:req.query.is_verified},{where:{user_id:req.query.user_id}})
  return {status:"success",message:"User verified successfully"}
};

const getCompanyUsers=async(req)=>{
  const userId=await tokenService.decodeToken(req.headers.authorization)
  if(userId===1){
    const user_details=await User.findAll({where:{[Op.and]:{user_id:{[Op.ne]:userId},type:{[Op.eq]:"job poster"},is_user_verified:{[Op.ne]:true},is_email_verified:true}}})
    return{status:"success",user_details}
  }else{
    throw new ApiError(httpStatus.UNAUTHORIZED,"You are unauthorized")
  }
}

module.exports = {
  loginUserWithEmailAndPassword,
  getByEmail,
  refreshAuth,
  resetPassword,
  getById,
  signup,
  forgotPassword,
  resendCode,
  verifyCode,
  logOut,
  signupCode,
  verifyUser,
  getCompanyUsers
};
