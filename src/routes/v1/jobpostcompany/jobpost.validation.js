const Joi = require("joi");

const jobPostApi = {
  body: Joi.object().keys({
      company_id: Joi.number().required(),
      job_type:Joi.string().required().valid("private", "state", "central"),
      location: Joi.string().required(),
      job_name: Joi.number().required(),
      start_date: Joi.string().required(),
      end_date:Joi.string().required(),
      address:Joi.string().required(),
      qualification:Joi.string().required(),
      experience:Joi.string().required(),
      martial_status:Joi.string().required(),
      job_description:Joi.string().required(),
      skills:Joi.string().required(),
      job_vacancy_places:Joi.string().required(),
      other_details:Joi.string().required(),
      phone_number:Joi.string().required(),
      start_age:Joi.string().required(),
      end_age:Joi.string().required(),
      salary:Joi.string().required(),
      incentive:Joi.string().required(),
      district:Joi.number().required(),
      town:Joi.string().required(),
      job_groups:Joi.string().required(),
      well_established:Joi.boolean().required(),
      interview_type:Joi.string().required().valid("walkin", "online"),
  })
};

const editPostApi = {
  body: Joi.object().keys({
      jobid:Joi.number().required(),
      company_id: Joi.number().required(),
      job_type:Joi.string().required().valid("private", "state", "central"),
      location: Joi.string().required(),
      job_name: Joi.number().required(),
      start_date: Joi.string().required(),
      end_date:Joi.string().required(),
      address:Joi.string().required(),
      qualification:Joi.string().required(),
      experience:Joi.string().required(),
      martial_status:Joi.string().required(),
      job_description:Joi.string().required(),
      skills:Joi.string().required(),
      job_vacancy_places:Joi.string().required(),
      other_details:Joi.string().required(),
      phone_number:Joi.string().required(),
      start_age:Joi.string().required(),
      end_age:Joi.string().required(),
      salary:Joi.string().required(),
      incentive:Joi.string().required(),
      district:Joi.number().required(),
      town:Joi.string().required(),
      job_groups:Joi.string().required(),
      well_established:Joi.boolean().required(),
      interview_type:Joi.string().required().valid("walkin", "online"),
  })
};

const getJobPost = {
  query: Joi.object().keys({
    district: Joi.string().optional().allow("", null),
}),
};


const addDesignation = {
  body: Joi.object().keys({
    designation: Joi.string().required()
  })
};

const editDesignation = {
  body: Joi.object().keys({
    designation_id:Joi.number().required(),
    designation: Joi.string().required()
  })
};


module.exports = {
    jobPostApi,
    editPostApi,
    getJobPost,
    editDesignation,
    addDesignation
};