const express = require("express");
const validate = require("../../../middlewares/validate");
const userValidate = require("./user.validation");
const userController = require("./user.controller");
const auth = require("../../../middlewares/auth");

const router = express.Router();

router.post(
  "/adddetails",
  auth(),
  validate(userValidate.addUserDetails),
  userController.addUserDetails
);
router.post(
  "/editdetails",
  auth(),
  validate(userValidate.editUserDetails),
  userController.editUserDetails
);
router.get("/getuserdetails", auth(), userController.getUserDetails); //,validate(userValidate.getUserDetails)
router.get("/getdistrict", auth(), userController.getDistrict);
router.post(
  "/postopinon",
  auth(),
  validate(userValidate.postOpinion),
  userController.postOpinion
);
router.get("/getopinion", auth(), userController.getOpinion);
router.post(
  "/editopinon",
  auth(),
  validate(userValidate.editOpinion),
  userController.editOpinion
);

router.get("/getdesignation",auth(),userController.getDesignation)

module.exports = router;
