const express=require("express")
const validate = require("../../../middlewares/validate");
const auth = require("../../../middlewares/auth");
const applyJobValidation=require("./job.validation")
const applyJobController = require("./job.controller");
const router=express.Router()

router.post("/applyjob",auth(),validate(applyJobValidation.applyjob),applyJobController.applyJob)
router.get("/applyjob",auth(),applyJobController.getAppliedjob)
router.post("/editapplyjob",auth(),validate(applyJobValidation.editApplyJob),applyJobController.editApplyJob)
router.get("/cancelapplyjob",auth(),validate(applyJobValidation.cancelApplyJob),applyJobController.cancelAppliedJob)
router.post("/favouritejob",auth(),validate(applyJobValidation.likeJob),applyJobController.likeJob)
router.get("/favouritejob",auth(),applyJobController.getFavouriteJob)
router.post("/jobscam",auth(),validate(applyJobValidation.scamJob),applyJobController.scamJob)
router.get("/jobscam",auth(),applyJobController.getScamJob)
router.get("/getjob",auth(),validate(applyJobValidation.getUserjob),applyJobController.getUserjob)
router.get("/getjobbyid",auth(),validate(applyJobValidation.getJobById),applyJobController.getJobById)
router.get("/getdistrictjobs",auth(),validate(applyJobValidation.getJobByDistrict),applyJobController.getJobByDistrict)
router.post("/jobremainder",auth(),validate(applyJobValidation.jobRemainder),applyJobController.jobRemainder)
router.post("/editjobremainder",auth(),validate(applyJobValidation.editJobRemainder),applyJobController.editJobRemainder)
router.get("/getjobremainder",auth(),validate(applyJobValidation.getJobRemainder),applyJobController.getJobRemainder)
module.exports=router