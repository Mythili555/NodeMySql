const httpStatus = require("http-status");
const Sequelize = require("sequelize");
// const moment = require("moment");
const { Op } = Sequelize;
const db = require("../../../models");
const UserDetails = db.userDetails;
const District = db.district;
const User = db.user;
const Opinion = db.opinon;
const Designation=db.designation
const ApiError = require("../../../utils/ApiError");
const { tokenService } = require("../../../services");

const addUserDetails = async (req) => {
  console.log(req.body, "body");
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const userDetails = await UserDetails.create({
      district: req.body.district,
      qualification: req.body.qualification,
      city: req.body.city,
      gender: req.body.gender,
      dob: req.body.dob,
      education: req.body.education,
      jobtype: req.body.jobtype,
      user_id: userId,
      selected_district: req.body.selecteddistrict,
      designation: req.body.designation,
    });
    if (userDetails) {
      await User.update(
        { is_profile_updated: true },
        { where: { user_id: userId } }
      );
      return {
        status: "success",
        message: "userDetails added Successfully",
        userDetails,
      };
    } else {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      );
    }
  } catch (e) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong " + e
    );
  }
};

const editUserDetails = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const userdetails = await UserDetails.findOne({
      where: { userdetails_id: req.body.userdetails_id },
    });
    if (!userdetails) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid userdetails_id");
    }
    const userDetails = await UserDetails.update(
      {
        district: req.body.district,
        qualification: req.body.qualification,
        city: req.body.city,
        gender: req.body.gender,
        dob: req.body.dob,
        education: req.body.education,
        jobtype: req.body.jobtype,
        user_id: userId,
        selected_district: req.body.selecteddistrict,
      designation: req.body.designation,
      },
      { where: { userdetails_id: req.body.userdetails_id } }
    );

    if (userDetails) {
      return { status: "success", message: "userDetails updated Successfully" };
    } else {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      );
    }
  } catch (e) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong " + e
    );
  }
};

const getUserDetails = async (req) => {
  const userId = await tokenService.decodeToken(req.headers.authorization);
  const userdetails = await UserDetails.findOne({ where: { user_id: userId } });
  if (!userdetails || userdetails === null) {
    return { status: "success", message: "No Record Found" };
  }
  return { status: "success", userdetails };
};

const getDistrict = async (req) => {
  const getdistrict = await District.findAll();
  const response = await Promise.all(
    getdistrict.map((value) => {
      value.sort_district = [...value.sort_district];
      return value;
    })
  );
  return { status: "success", response };
};

const postOpinion = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const opinion = await Opinion.create({
      name: req.body.name,
      description: req.body.description,
      district: req.body.district,
      posted_by: userId,
    });

    if (opinion) {
      return {
        status: "success",
        message: "opinion added Successfully",
        opinion,
      };
    } else {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      );
    }
  } catch (e) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong " + e
    );
  }
};

const getOpinion = async (req) => {
  // const userId=await tokenService.decodeToken(req.headers.authorization)
  const opinon = await Opinion.findAll();
  if (!opinon || opinon === null) {
    return { status: "success", message: "No Record Found" };
  }
  return { status: "success", opinon };
};

const editOpinion = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const opinion = await Opinion.update(
      {
        name: req.body.name,
        description: req.body.description,
        district: req.body.district,
        posted_by: userId,
      },
      { where: { opinion_id: req.body.opinion_id } }
    );

    if (opinion) {
      return { status: "success", message: "opinion edited Successfully" };
    } else {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      );
    }
  } catch (e) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong " + e
    );
  }
};


const getDesignation = async (req) => {
  const designation = await Designation.findAll();
  return { status: "success", designation };
};
module.exports = {
  addUserDetails,
  editUserDetails,
  getUserDetails,
  getDistrict,
  postOpinion,
  editOpinion,
  getDesignation,
  getOpinion
};
