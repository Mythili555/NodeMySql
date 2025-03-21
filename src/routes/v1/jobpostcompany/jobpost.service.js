const httpStatus = require("http-status");
const Sequelize = require("sequelize");
// const moment = require("moment");
const { Op } = Sequelize;
const db = require("../../../models");
// const UserDetails =db.userDetails
const jobPosts = db.jobDetails;
const User = db.user;
const Designation=db.designation
const ApiError = require("../../../utils/ApiError");
const { tokenService } = require("../../../services");

const jobPostApi = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    console.log(userId, "userid");
    const jobPost = await jobPosts.create({
      company_id: req.body.company_id,
      job_type: req.body.job_type,
      location: req.body.location,
      job_name: req.body.job_name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      address: req.body.address,
      created_by: userId,
      qualification: req.body.qualification,
      experience: req.body.experience,
      martial_status: req.body.martial_status,
      job_description: req.body.job_description,
      skills: req.body.skills,
      job_vacancy_places: req.body.job_vacancy_places,
      other_details: req.body.other_details,
      phone_number: req.body.phone_number,
      //   report:req.body.report,
      //   scam:req.body.scam,
      start_age: req.body.start_age,
      end_age: req.body.end_age,
      salary: req.body.salary,
      incentive: req.body.incentive,
      //   created_by:req.body.created_by,
      district: req.body.district,
      town: req.body.town,
      job_groups: req.body.job_groups,
      well_established: req.body.well_established,
      interview_type:req.body.interview_type,
    });

    if (jobPost) {
      return {
        status: "success",
        message: "jobPost added Successfully",
        jobPost,
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

const editPostApi = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }

    const job = await jobPosts.findAll({ where: { job_id: req.body.jobid } });
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Job Id");
    }
    console.log(userId, "userid");
    const jobPost = await jobPosts.update(
      {
        company_id: req.body.company_id,
        job_type: req.body.job_type,
        location: req.body.location,
        job_name: req.body.job_name,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        address: req.body.address,
        created_by: userId,
        qualification: req.body.qualification,
        experience: req.body.experience,
        martial_status: req.body.martial_status,
        job_description: req.body.job_description,
        skills: req.body.skills,
        job_vacancy_places: req.body.job_vacancy_places,
        other_details: req.body.other_details,
        phone_number: req.body.phone_number,
        //   report:req.body.report,
        //   scam:req.body.scam,
        start_age: req.body.start_age,
        end_age: req.body.end_age,
        salary: req.body.salary,
        incentive: req.body.incentive,
        //   created_by:req.body.created_by,
        district: req.body.district,
        town: req.body.town,
        job_groups: req.body.job_groups,
        well_established: req.body.well_established,
        interview_type:req.body.interview_type,
      },
      { where: { job_id: req.body.jobid } }
    );

    if (jobPost) {
      return { status: "success", message: "jobPost updated Successfully" };
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
const getJobPost = async (req) => {
  const userId = await tokenService.decodeToken(req.headers.authorization);
  const user = await User.findAll({ where: { user_id: userId } });
  if (!user || user == "") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
  }
  console.log(userId, "pppp");
  const getJobPost = await jobPosts.findAll({
    where: { created_by: userId },
  });
  if (getJobPost) {
    return { status: "success", getJobPost };
  }
  if (getJobPost.length == 0) {
    return { status: "success", message: "No record found" };
  }
};

const addDesignation = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    console.log(userId, "userid");
    const designation = await Designation.create({
      designation: req.body.designation,
    });

    if (designation) {
      return {
        status: "success",
        message: "Designation added Successfully",
        designation,
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

const editDesignation = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }

    const designation = await Designation.findAll({ where: { designation_id: req.body.designation_id} });
    if (!designation || designation == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Job Id");
    }
    const editDesignation = await Designation.update(
      {
        designation: req.body.designation,
      },
      { where: { designation_id: req.body.designation_id } }
    );

    if (editDesignation) {
      return { status: "success", message: "Designation updated Successfully" };
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
  const userId = await tokenService.decodeToken(req.headers.authorization);
  const user = await User.findAll({ where: { user_id: userId } });
  if (!user || user == "") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
  }
  const getDesignation = await Designation.findAll({
  });
  if (getDesignation) {
    return { status: "success", getDesignation };
  }
  if (getDesignation.length == 0) {
    return { status: "success", message: "No record found" };
  }
};

module.exports = {
  jobPostApi,
  editPostApi,
  getJobPost,
  editDesignation,
  addDesignation,
  getDesignation
};
