const httpStatus = require("http-status");
const ApiError = require("../../../utils/ApiError");
const catchAsync = require("../../../utils/catchAsync");
const userService = require("./user.service");

const addUserDetails = catchAsync(async (req, res) => {
  const response = await userService.addUserDetails(req, res);
  res.status(httpStatus.OK).send({ response });
});

const editUserDetails = catchAsync(async (req, res) => {
  const response = await userService.editUserDetails(req, res);
  res.status(httpStatus.OK).send({ response });
});
const getUserDetails = catchAsync(async (req, res) => {
  const response = await userService.getUserDetails(req, res);
  res.status(httpStatus.OK).send({ response });
});
const getDistrict = catchAsync(async (req, res) => {
  const response = await userService.getDistrict(req, res);
  res.status(httpStatus.OK).send({ response });
});
const postOpinion = catchAsync(async (req, res) => {
  const response = await userService.postOpinion(req, res);
  res.status(httpStatus.OK).send({ response });
});
const getOpinion = catchAsync(async (req, res) => {
  const response = await userService.getOpinion(req, res);
  res.status(httpStatus.OK).send({ response });
});
const editOpinion = catchAsync(async (req, res) => {
  const response = await userService.editOpinion(req, res);
  res.status(httpStatus.OK).send({ response });
});
const getDesignation = catchAsync(async (req, res) => {
  const response = await userService.getDesignation(req, res);
  res.status(httpStatus.OK).send({ response });
});
module.exports = {
  addUserDetails,
  editUserDetails,
  getUserDetails,
  getDistrict,
  postOpinion,
  getOpinion,
  editOpinion,
  getDesignation
};
