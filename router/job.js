const express = require("express");
const router = express.Router();
const {basicAuth} = require("../middileware/basicAuth")
const {createAjob,getOneJob,findAllJob,searchJob,deleteOneJob,deleteJob,updateJobdetails
} = require("../controllers/job");

router.post(
    "/createAjob",
    createAjob
  );
  router.post(
    "/getOneJob",
    getOneJob
  );
  router.get(
    "/findAllJob",
    findAllJob
  );
  router.delete(
    "/deleteOneJob",
    deleteOneJob
  );
  router.delete(
    "/deleteJob",
    deleteJob
  )
  router.put(
    "/updateJobDetails",
    updateJobdetails
  );
router.get(
  "/searchJob",
  searchJob
);
  module.exports = router;