const httpStatus = require("http-status");
const Sequelize = require("sequelize");
const moment = require("moment");
const { Op } = Sequelize;
const db = require("../../../models");
const { sequelize, user, userAddress } = require("../../../models");
const UserDetails = db.userDetails;
const jobPosts = db.jobDetails;
const User = db.user;
const applyjob = db.appliedJobs;
const favouriteJob = db.favouriteJobs;
const scamjob = db.scamJob;
const District = db.district;
const remainderJob=db.jobremainder;
const Designation=db.designation
const ApiError = require("../../../utils/ApiError");
const { tokenService } = require("../../../services");
const Template = db.pushNotificationTemplates

const applyJob = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const getJobPost = await jobPosts.findAll({
      where: { job_id: req.body.job_id },
    });
    if (!getJobPost) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid JobId");
    }
    const job = await applyjob.findAll({
      where: { job_details_id: req.body.job_id, user_id: userId, active: true, applied: true },
    });
    if (job.length > 0 || job != "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Job has been already applied");
    }
    const jobPost = await applyjob.create({
      job_details_id: req.body.job_id,
      company_id: req.body.company_id,
      notify_time: req.body.notify_time,
      user_id: userId,
    });

    if (jobPost) {
      return { status: "success", message: "Job Applied Successfully", jobPost };
    }
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const getAppliedjob = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }

    const job = await applyjob.findAll({
      where: { user_id: userId, active: true, applied: true },
      include: [
        {
          model: jobPosts,
          required: true,
          // as: "user_devices",
          // where: { user_id: { [Op.eq]: `${userId}` } },
        },
      ],
      order: [[jobPosts, "created_by", "DESC"]],
    });
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "No record found!!");
    }
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const editApplyJob = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const job = await applyjob.findAll({
      where: { job_details_id: req.body.job_id, user_id: userId, active: true, applied: true },
    });
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid JobId");
    }
    const jobPost = await applyjob.update(
      {
        job_details_id: req.body.job_id,
        company_id: req.body.company_id,
        notify_time: req.body.notify_time,
        user_id: userId,
      },
      { where: { job_details_id: req.body.job_id, user_id: userId } }
    );

    if (jobPost) {
      return { status: "success", message: "Job Applied Edited Successfully" };
    }
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};
const cancelAppliedJob = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const job = await applyjob.findAll({
      where: { job_details_id: req.query.job_id, user_id: userId },
    });
    if (!job) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid JobId");
    }
    const jobPost = await applyjob.update(
      {
        applied: false,
      },
      { where: { job_details_id: req.query.job_id, user_id: userId } }
    );

    if (jobPost) {
      return { status: "success", message: "Job Applied Edited Successfully" };
    }
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const likeJob = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const job = await jobPosts.findAll({
      where: { job_id: req.body.job_id },
    });
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid JobId");
    }

    const jobfind = await favouriteJob.findAll({
      where: { job_details_id: req.body.job_id, liked_by: userId },
    });
    if (jobfind && jobfind != "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "JobId already added to favourites.Please check in favourites tab.");
    }

    const jobPost = await favouriteJob.create({
      job_details_id: req.body.job_id,
      company_id: req.body.company_id,
      liked_by: userId,
    });

    if (jobPost) {
      return { status: "success", message: "Job Successfully added to favourites" };
    }
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const getFavouriteJob = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }

    const job = await favouriteJob.findAll({
      where: { liked_by: userId },
      // attributes:["job_id"],
      include: [
        {
          model: jobPosts,
          required: true,
          // as: "user_devices",
          // where: { user_id: { [Op.eq]: `${userId}` } },
        },
      ],
      order: [[jobPosts, "created_by", "DESC"]],
    });
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "No record found!!");
    }
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const scamJob = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const job = await jobPosts.findAll({
      where: { job_id: req.body.job_id },
    });
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid JobId");
    }

    const jobfind = await scamjob.findAll({
      where: { job_details_id: req.body.job_id, reported_by: userId },
    });
    if (jobfind && jobfind != "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "JobId already added to scam list.");
    }

    const jobPost = await scamjob.create({
      job_details_id: req.body.job_id,
      company_id: req.body.company_id,
      reported_by: userId,
    });

    if (jobPost) {
      return { status: "success", message: "Reported Successfully" };
    }
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const getScamJob = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }

    const job = await scamjob.findAll({
      include: [
        {
          model: jobPosts,
          required: true,
          // as: "user_devices",
          // where: { user_id: { [Op.eq]: `${userId}` } },
        },
      ],
      order: [[jobPosts, "created_by", "DESC"]],
    });
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "No record found!!");
    }
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const getFavouriteJobList = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }

    const job = await favouriteJob.findAll({
      where: { liked_by: userId },
      // attributes:["job_id"],
    });
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const getUserjob = async (req) => {
  try {
    console.log(req.headers.authorization);
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const userdetails = await UserDetails.findOne({ where: { user_id: userId } });
    if (req.query.job_type == "mydistrict") {
      return await getUserDistrictJob(req);
    }
    if (req.query.job_type == "otherdistrict") {
      return await getOtherDistrictJob(req);
    }
    if (req.query.job_type == "nearbydistrict") {
      return await naerByDistrictJob(req);
    }
    if (req.query.job_type == "state") {
      return await stateJobs(req);
    }
    if (req.query.job_type == "central") {
      return await CentralJobs(req);
    }
    if (req.query.job_type == "walkin") {
      return await walkInJobs(req);
    }
    if (req.query.district_id) {
      return await getJobByDistrict(req);
    }
    if (req.query.designation_id) {
      return await getJobByDesignation(req);
    }

    const job = await sequelize.query(
      `SELECT
    j.*,
    d.district as district_name,
    ds.designation as job_name,
    IF(f.job_details_id IS NOT NULL, true, false) AS liked_job
FROM
    jobdetails j
    LEFT JOIN favouritejobs f ON j.job_id = f.job_details_id
    AND f.liked_by = ${userId}
LEFT JOIN
  districts d ON j.district = d.district_id
  LEFT JOIN
  designations ds ON j.job_name = ds.designation_id   
where
j.district IN (${userdetails.selected_district})
order by
    j.createdAt DESC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "No record found!!");
    }
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const getUserDistrictJob = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const userdetails = await UserDetails.findOne({ where: { user_id: userId } });
    if (!userdetails || userdetails == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Please Fill User Details");
    }
    const district = await District.findOne({ where: { district: { [Op.eq]: userdetails.district } } });
    if(!district||district==""){
      throw new ApiError(httpStatus.BAD_REQUEST, "Please enter your district.The district you have enterted is wrong.");
    }

    const job = await sequelize.query(
      `SELECT
    j.*,
    ds.designation as job_name,
    d.district as district_name,
    IF(f.job_details_id IS NOT NULL, true, false) AS liked_job
FROM
    jobdetails j
    LEFT JOIN favouritejobs f ON j.job_id = f.job_details_id
    AND f.liked_by = ${userId}
LEFT JOIN
  districts d ON j.district = d.district_id
  LEFT JOIN
  designations ds ON j.job_name = ds.designation_id 
where
    j.district =${district.district_id}
order by
    j.createdAt DESC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "No record found!!");
    }
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const getOtherDistrictJob = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    console.log(userId,"post");
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const userdetails = await UserDetails.findOne({ where: { user_id: userId } });
    if (!userdetails || userdetails == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Please Fill User Details");
    }
    const district = await District.findOne({ where: { district: { [Op.eq]: userdetails.district } } });
    const job = await sequelize.query(
      `SELECT
    j.*,
    d.district as district_name,
    ds.designation as job_name,
    IF(f.job_details_id IS NOT NULL, true, false) AS liked_job
FROM
    jobdetails j
    LEFT JOIN favouritejobs f ON j.job_id = f.job_details_id
    AND f.liked_by = ${userId}
LEFT JOIN
  districts d ON j.district = d.district_id
  LEFT JOIN
  designations ds ON j.job_name = ds.designation_id   
where
j.district NOT IN (${userdetails.selected_district}) AND j.district NOT IN (${district.district_id})
order by
    j.createdAt DESC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "No record found!!");
    }
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const naerByDistrictJob = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const userdetails = await UserDetails.findOne({ where: { user_id: userId } });
    console.log(userdetails);
    if (!userdetails || userdetails == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Please Fill User Details");
    }
    const district = await District.findOne({ where: { district: { [Op.eq]: userdetails.district } } });
    // const job = await jobPosts.findAll({
    //   where: { district: { [Op.in]: district.nearest_district } },
    //   order: [["created_by", "DESC"]],
    // });
    const job = await sequelize.query(
      `SELECT
    j.*,
    d.district as district_name,
    ds.designation as job_name,
    IF(f.job_details_id IS NOT NULL, true, false) AS liked_job
FROM
    jobdetails j
    LEFT JOIN favouritejobs f ON j.job_id = f.job_details_id
    AND f.liked_by = ${userId}
LEFT JOIN
  districts d ON j.district = d.district_id
  LEFT JOIN
  designations ds ON j.job_name = ds.designation_id  
where
j.district IN (${district.nearest_district})
order by
    j.createdAt DESC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "No record found!!");
    }
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const stateJobs = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    // const userdetails = await UserDetails.findOne({ where: { user_id: userId } });
    // console.log(userdetails);
    // const district=await District.findOne({where: { district:{[Op.eq]: userdetails.district} }})
    // const job = await jobPosts.findAll({
    //   where: { job_type: { [Op.eq]: req.query.job_type } },
    //   order: [["created_by", "DESC"]],
    // });
    const job = await sequelize.query(
      `SELECT
    j.*,
    d.district as district_name,
    ds.designation as job_name,
    IF(f.job_details_id IS NOT NULL, true, false) AS liked_job
FROM
    jobdetails j
    LEFT JOIN favouritejobs f ON j.job_id = f.job_details_id
    AND f.liked_by = ${userId}
    LEFT JOIN
  designations ds ON j.job_name = ds.designation_id 
LEFT JOIN
  districts d ON j.district = d.district_id
where
j.job_type = '${req.query.job_type}'
order by
    j.createdAt DESC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "No record found!!");
    }
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const CentralJobs = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const userdetails = await UserDetails.findOne({ where: { user_id: userId } });
    console.log(userdetails);

    // const job = await jobPosts.findAll({
    //   where: { job_type: { [Op.eq]: req.query.job_type } },
    //   order: [["created_by", "DESC"]],
    // });
    const job = await sequelize.query(
      `SELECT
    j.*,
    d.district as district_name,
    ds.designation as job_name,
    IF(f.job_details_id IS NOT NULL, true, false) AS liked_job
FROM
    jobdetails j
    LEFT JOIN favouritejobs f ON j.job_id = f.job_details_id
    AND f.liked_by = ${userId}
LEFT JOIN
  districts d ON j.district = d.district_id
LEFT JOIN
  designations ds ON j.job_name = ds.designation_id   
where
j.job_type = '${req.query.job_type}'
order by
    j.createdAt DESC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "No record found!!");
    }
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const walkInJobs = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const userdetails = await UserDetails.findOne({ where: { user_id: userId } });
    console.log(userdetails);

    // const job = await jobPosts.findAll({
    //   where: { interview_type: { [Op.eq]: req.query.job_type } },
    //   order: [["created_by", "DESC"]],
    // });
    const job = await sequelize.query(
      `SELECT
    j.*,
    d.district as district_name,
    ds.designation as job_name,
    IF(f.job_details_id IS NOT NULL, true, false) AS liked_job
FROM
    jobdetails j
    LEFT JOIN favouritejobs f ON j.job_id = f.job_details_id
    AND f.liked_by = ${userId}
LEFT JOIN
  districts d ON j.district = d.district_id
LEFT JOIN
  designations ds ON j.job_name = ds.designation_id    
where
j.interview_type = '${req.query.job_type}'
order by
    j.createdAt DESC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "No record found!!");
    }
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const getJobById = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const userdetails = await UserDetails.findOne({ where: { user_id: userId } });
    // console.log(userdetails)

    const job = await jobPosts.findOne({
      where: { job_id: { [Op.eq]: req.query.job_id } },
      order: [["created_by", "DESC"]],
    });
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "No record found!!");
    }

    job.is_applied = false;
    const modifiedJob = Object.assign({}, job.get(), { is_applied: false });
    console.log(modifiedJob);
    const appliedjob = await applyjob.findAll({
      where: { user_id: userId, active: true, applied: true },
      include: [
        {
          model: jobPosts,
          required: true,
          // as: "user_devices",
          // where: { user_id: { [Op.eq]: `${userId}` } },
        },
      ],
      order: [[jobPosts, "created_by", "DESC"]],
    });
    let jobdetails = [];
    console.log(appliedjob);
    if (appliedjob && appliedjob.length > 0) {
      for (const item of appliedjob) {
        let appliedJobDetails = { ...job.dataValues, is_applied: false };
        if (item.job_details_id === job.job_id) {
          appliedJobDetails.is_applied = true;
          jobdetails.push(appliedJobDetails);
        }
      }
    }
    if (jobdetails && jobdetails.length > 0) {
      return { status: "success", jobdetails };
    } else {
      return { status: "success", modifiedJob };
    }
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const getJobByDistrict = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const userdetails = await UserDetails.findOne({ where: { user_id: userId } });
    console.log(userdetails);

    const job = await jobPosts.findAll({
      where: { district: { [Op.eq]: req.query.district_id } },
      order: [["created_by", "DESC"]],
    });
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "No record found!!");
    }
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const getJobByDesignation = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const userdetails = await UserDetails.findOne({ where: { user_id: userId } });
    console.log(userdetails);

    // const job = await jobPosts.findAll({
    //   where: { job_name: { [Op.eq]: req.query.designation_id } },
    //   order: [["created_by", "DESC"]],
    // });
    const job= await sequelize.query(
      `SELECT
    j.*,
    d.district as district_name,
    ds.designation as job_name,
    IF(f.job_details_id IS NOT NULL, true, false) AS liked_job
FROM
    jobdetails j
    LEFT JOIN favouritejobs f ON j.job_id = f.job_details_id
    AND f.liked_by = ${userId}
LEFT JOIN
  districts d ON j.district = d.district_id
LEFT JOIN
designations ds ON j.job_name = ds.designation_id  
where
j.job_name = ${req.query.designation_id}
order by
    j.createdAt DESC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "No record found!!");
    }
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};


const jobRemainder = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const job = await jobPosts.findAll({
      where: { job_id: req.body.job_id },
    });
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid JobId");
    }

    const jobremainder= await remainderJob.findAll({
      where: { job_id: req.body.job_id,user_id:userId },
    });
    if (jobremainder) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Job Remainder has already applied.");
    }
    const jobremainders = await remainderJob.create({
      notify_time: moment(new Date (req.body.notify_time)).utc().format("YYYY-MM-DD HH:mm:ss"),
      // start_date: req.body.start_date,
      remainded_by: userId,
      job_id:req.body.job_id
    });

    if (jobremainders) {
      return { status: 200, message: "Reported Successfully",jobremainders };
    }
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const editJobRemainder = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }
    const job = await jobPosts.findAll({
      where: { job_id: req.body.job_id },
    });
    if (!job || job == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid JobId");
    }

    const jobremainder= await remainderJob.findAll({
      where: { job_id: req.body.job_id,user_id:userId,job_remainder_id:req.body.job_remainder_id,job_id:req.body.job_id },
    });
    if (!jobremainder || jobremainder == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Job Remainder has already applied.");
    }
    const jobremainders = await remainderJob.update({
      notify_time: moment(new Date (req.body.notify_time)).utc().format("YYYY-MM-DD HH:mm:ss"),
      // start_date: req.body.start_date,
      remainded_by: userId,
      job_id:req.body.job_id
    },{where:{job_remainder_id:req.body.job_remainder_id }});

    if (jobremainders) {
      return { status: "success", message: "Reported Successfully",jobremainders };
    }
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const getJobRemainder = async (req) => {
  try {
    const userId = await tokenService.decodeToken(req.headers.authorization);
    const user = await User.findAll({ where: { user_id: userId } });
    if (!user || user == "") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid UserId");
    }

    const job = await remainderJob.findAll({
      where: { remainded_by: userId,job_id:req.query.job_id },
      // attributes:["job_id"],
    });
    return { status: "success", job };
  } catch (e) {
    if (e instanceof ApiError) {
      throw e;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong " + e);
    }
  }
};

const jobRemainderNotification = async () => {
  console.log("mkabil");
  const startDate = moment().utc().startOf('minute').format('YYYY-MM-DD HH:mm:ss');
  const EndDate = moment().utc().endOf('minute').add(10,'M').format('YYYY-MM-DD HH:mm:ss');
  const userRouteExpirationCheck=await sequelize.query(`SELECT * FROM jobremainders
  WHERE ( notify_time IS NOT NULL AND (notify_time >= '${startDate}' AND notify_time < '${EndDate}' AND job_id !=0));`,{ type: Sequelize.QueryTypes.SELECT });
  if(userRouteExpirationCheck.length){
await Promise.all(userRouteExpirationCheck.map(async (job) => {
  const jobs=await jobPosts.findOne({
    where: { job_id: job.job_id },
  }); 
  const jobtitle=await Designation.findOne({
    where: { designation_id: jobs.job_name },
  }); 
  const title = await getTemplate('jobremainder')
  const data = await jobtitle.designation + " " + title.content
  await sendPushNotification(title.title, data, [`${job.remainded_by}`])
}))
}
}


const getTemplate = async (template_code) => {
  const template = await Template.findOne({
    where: { template_code: template_code },
    attributes: ["title", "content"]
  })
  if (template) {
    return template
  }
};
module.exports = {
  applyJob,
  getAppliedjob,
  editApplyJob,
  cancelAppliedJob,
  likeJob,
  getFavouriteJob,
  scamJob,
  getScamJob,
  getUserjob,
  getUserDistrictJob,
  getJobById,
  getJobByDistrict,
  jobRemainder,
  editJobRemainder,
  getJobRemainder,
  jobRemainderNotification
};
