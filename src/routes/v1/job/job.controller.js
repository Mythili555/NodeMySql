const httpStatus = require("http-status");
const ApiError = require("../../../utils/ApiError");
const catchAsync = require("../../../utils/catchAsync");
const applyJobs = require("./job.service");

const applyJob = catchAsync(async (req, res) => {
  const response = await applyJobs.applyJob(req);
  res.status(httpStatus.OK).send({ response });
});

const getAppliedjob = catchAsync(async (req, res) => {
  const response = await applyJobs.getAppliedjob(req);
  res.status(httpStatus.OK).send({ response });
});


const editApplyJob = catchAsync(async (req, res) => {
  const response = await applyJobs.editApplyJob(req);
  res.status(httpStatus.OK).send({ response });
});


const cancelAppliedJob = catchAsync(async (req, res) => {
  const response = await applyJobs.cancelAppliedJob(req);
  res.status(httpStatus.OK).send({ response });
});

const likeJob = catchAsync(async (req, res) => {
  const response = await applyJobs.likeJob(req);
  res.status(httpStatus.OK).send({ response });
});

const getFavouriteJob = catchAsync(async (req, res) => {
  const response = await applyJobs.getFavouriteJob(req);
  res.status(httpStatus.OK).send({ response });
});

const scamJob = catchAsync(async (req, res) => {
  const response = await applyJobs.scamJob(req);
  res.status(httpStatus.OK).send({ response });
});

const getScamJob = catchAsync(async (req, res) => {
  const response = await applyJobs.getScamJob(req);
  res.status(httpStatus.OK).send({ response });
});
const getUserjob=catchAsync(async (req, res)=>{
  const response=await applyJobs.getUserjob(req);
  res.status(httpStatus.OK).send({response})
})


const getJobById=catchAsync(async (req, res)=>{
  const response=await applyJobs.getJobById(req);
  res.status(httpStatus.OK).send({response})
})

const getJobByDistrict=catchAsync(async (req, res)=>{
  const response=await applyJobs.getJobByDistrict(req);
  res.status(httpStatus.OK).send({response})
})

const jobRemainder=catchAsync(async (req, res)=>{
  const response=await applyJobs.jobRemainder(req);
  res.status(httpStatus.OK).send({response})
})

const editJobRemainder=catchAsync(async (req, res)=>{
  const response=await applyJobs.editJobRemainder(req);
  res.status(httpStatus.OK).send({response})
})

const getJobRemainder=catchAsync(async (req, res)=>{
  const response=await applyJobs.getJobRemainder(req);
  res.status(httpStatus.OK).send({response})
})
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
    getJobById,
    getJobByDistrict,
    jobRemainder,
    editJobRemainder,
    getJobRemainder
};
