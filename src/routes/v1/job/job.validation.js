const Joi = require("joi");

const applyjob = {
  body: Joi.object().keys({
      job_id: Joi.number().required(),
      company_id:Joi.string().required(),
      notify_time: Joi.string().required(),
  })
};

const editApplyJob = {
  body: Joi.object().keys({
      job_id: Joi.number().required(),
      company_id:Joi.string().required(),
      notify_time: Joi.string().required(),
  })
};

const cancelApplyJob = {
  query: Joi.object().keys({
      job_id: Joi.number().required(),
  })
};

const likeJob = {
  body: Joi.object().keys({
      job_id: Joi.number().required(),
      company_id: Joi.number().required(),
      // liked_by:Joi.number().required(),
  })
};

const scamJob = {
  body: Joi.object().keys({
      job_id: Joi.number().required(),
      company_id: Joi.number().required(),
      // reported_by:Joi.number().required(),
  })
};

const getUserjob = {
  query: Joi.object().keys({
    job_type: Joi.string()
    .valid(
      "mydistrict",
      "nearbydistrict",
      "otherdistrict",
      "preferddistrict",
      "walkin",
      "state",
      "central",
      "designationjobs"
    )
    .allow("", null),
  designation_id: Joi.number().allow("", null),
  district_id: Joi.when(
    Joi.object({
      job_type: Joi.string().empty(""),
      designation_id: Joi.number().empty(""),
    }).unknown(),
    {
      then: Joi.number().allow("", null),
      otherwise: Joi.number().required(),
    }
  ),
  }).or('job_type', 'designation_id','district_id')
  
};
// route_id:Joi.number().allow("", null),
//     shared_route_id:Joi.when('route_id', {is:"",then: Joi.number(),otherwise: Joi.number().allow('',null)}),

// const getUserjob = {
//   query: Joi.object().keys({
//     job_type: Joi.string().valid(
//       "mydistrict",
//       "nearbydistrict",
//       "otherdistrict",
//       "preferddistrict",
//       "walkin",
//       "state",
//       "central",
//       "designationjobs"
//     ),
//     district_id: Joi.number(),
//   }).xor("job_type", "district_id"),
// };


const getJobById = {
  query: Joi.object().keys({
    job_id: Joi.number()
    .required()
  })
};

const getJobByDistrict = {
  query: Joi.object().keys({
    district_id: Joi.number()
    .required()
  })
};

const jobRemainder = {
  body: Joi.object().keys({
      notify_time: Joi.number().required(),
      job_id:Joi.number().required(),
  })
};

const editJobRemainder = {
  body: Joi.object().keys({
      notify_time: Joi.number().required(),
      job_remainder_id:Joi.number().required(),
      job_id:Joi.number().required(),
  })
};

const getJobRemainder = {
  query: Joi.object().keys({
    job_id:Joi.number().required(),
  })
};
module.exports = {
    applyjob,
    editApplyJob,
    cancelApplyJob,
    likeJob,
    scamJob,
    getUserjob,
    getJobById,
    getJobByDistrict,
    jobRemainder,
    editJobRemainder,
    getJobRemainder
};