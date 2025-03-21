const Joi = require("joi");

const addUserDetails = {
  body: Joi.object().keys({
    district: Joi.string().required(),
    city: Joi.string().required(),
    gender: Joi.string().required().valid("Male", "Female", "Other"),
    dob: Joi.string().required(),
    education: Joi.string().required(),
    qualification: Joi.string().required(),
    selecteddistrict: Joi.array().required(),
    designation: Joi.array().required(),
    jobtype: Joi.string()
      .required()
      .valid("Full Time", "Part Time", "Remote", "Freelancer"),
  }),
};

const editUserDetails = {
  body: Joi.object().keys({
    userdetails_id: Joi.number().required(),
    district: Joi.string().required(),
    city: Joi.string().required(),
    gender: Joi.string().required().valid("Male", "Female", "Other"),
    dob: Joi.string().required(),
    education: Joi.string().required(),
    qualification: Joi.string().required(),
    // district: Joi.array().required(),
    selecteddistrict: Joi.array().required(),
    designation: Joi.array().required(),
    jobtype: Joi.string()
      .required()
      .valid("Full Time", "Part Time", "Remote", "Freelancer"),
  }),
};

// const getUserDetails = {
//     query: Joi.object().keys({
//         user_id: Joi.number().required(),
//     }),
// }

const postOpinion = {
  body: Joi.object().keys({
    description: Joi.string().required(),
    district: Joi.string().required(),
    name: Joi.string().required(),
  }),
};

const editOpinion = {
  body: Joi.object().keys({
    opinion_id: Joi.number().required(),
    description: Joi.string().required(),
    district: Joi.string().required(),
    name: Joi.string().required(),
  }),
};

module.exports = {
  addUserDetails,
  editUserDetails,
  postOpinion,
  editOpinion,
  // getUserDetails
};
