const httpStatus = require("http-status");
const ApiError = require("../../../utils/ApiError");
const catchAsync = require("../../../utils/catchAsync");
const jobPostService = require("./jobpost.service");

const jobPostApi = catchAsync(async (req, res) => {
  const response = await jobPostService.jobPostApi(req);
  res.status(httpStatus.OK).send({ response });
});

const editPostApi = catchAsync(async (req, res) => {
    const response = await jobPostService.editPostApi(req);
    res.status(httpStatus.OK).send({ response });
  });

  const getJobPost = catchAsync(async (req, res) => {
    const response = await jobPostService.getJobPost(req);
    res.status(httpStatus.OK).send({ response });
  });

  const addDesignation = catchAsync(async (req, res) => {
    const response = await jobPostService.addDesignation(req);
    res.status(httpStatus.OK).send({ response });
  });

  const editDesignation = catchAsync(async (req, res) => {
    const response = await jobPostService.editDesignation(req);
    res.status(httpStatus.OK).send({ response });
  });

  const getDesignation = catchAsync(async (req, res) => {
    const response = await jobPostService.getDesignation(req);
    res.status(httpStatus.OK).send({ response });
  });

module.exports = {
    jobPostApi,
    editPostApi,
    getJobPost,
    addDesignation,
    editDesignation,
    getDesignation
};
