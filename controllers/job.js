const jobsModel = require("../model/job");
var multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       if (file.fieldname === "profile") {
           cb(null, './uploads/profilePic/')
       }
       if (file.fieldname === "resume") {
           cb(null, './uploads/resume/')
       }
    },
    filename:(req,file,cb)=>{
        if (file.fieldname === "profile") {
            cb(null, file.fieldname+Date.now()+(file.originalname));
        }
        if (file.fieldname === "resume") {
        cb(null, file.fieldname+Date.now()+(file.originalname));
      }
    }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).fields([
  {
    name: "profile",
    maxCount: 1,
  },
  {
    name: "resume",
    maxCount: 1,
  }
]);

function checkFileType(file, cb) {
  if (file.fieldname === "resume") {
    if (
      file.mimetype === "application/pdf" 
    ) {
      // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else if ( file.fieldname === "profile") {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" 
    ) {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
}

// const createJobWithImage = multer({ storage: storage }).single("profile_image");

exports.createAjob = async (req, res) => {
  console.log("Testing");
  upload(req, res, (err) => {
    if (err) {
      return res.json(err);
    } else {
      var files = req.files;
      console.log("files", files);
      if (files !== null) {
          let resume = req.files.resume[0].path;
          let profile = req.files.profile[0].path;
        // console.log("profile",profile,resume);
        //   var image_url = process.env.HOST + files.path;
        //   var fileName = files.name;
          var data = req.body;
          var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
          console.log("data", data);
          var name = data.name;
          var mobileNumer = data.mobile_number;
          var email= data.email;
          if (name == null || name == "" || name == undefined) {
              return res.json({
                  status: 404,
                  message: "Please Enter Name"
              })
          }
          if (mobileNumer == null || mobileNumer == "" || mobileNumer == undefined) {
              return res.json({
                  status: 404,
                  message: "Please Enter mobileNumer"
              })
          }else if(isNaN(mobileNumer)){
            return res.json({
                status: 404,
                message: "Please Enter mobileNumer"
            })
          }
          if (email == null || email == "" || email == undefined) {
            
            return res.json({
                status: 404,
                message: "Please Enter email"
            })
        } else if(!emailRegex.test(email)){
            return res.json({
                status: 404,
                message: "Please Enter valid email"
            })
        }
          data = new jobsModel(data);
          data.set('profile', profile);
          data.set('resume', resume);
          console.log("data", data);
          data.save((err, saveData) => {
              if (err) {
                console.log("save error", err)
                  return res.json({
                      status: 500,
                      message: "Some thing is wrong"
                  })
              }
              else {
                  return res.json({
                      status: 200,
                      message: "Data Successfully Created"
                  })
              }
          });

      }
    }
  });
};

exports.getOneJob = async (req, res) => {
    const data = req.body;
    var id = data.id;
    if (id == null || id == "" || id == undefined) {
        return res.json({
            status: 400,
            message: "Please Enter Job ID"
        })
    }
    jobsModel.findOne({ _id: id, isDelete: false },  (err, data) => {
        if (err) {
            return res.json({
                status: 500,
                message: "Some thing is wrong"
            })
        }
        else {
            // console.log("data",data);
            if (!data) {
                return res.json({
                    status: 404,
                    message: "Data Not Found"
                })
            }
            else {
                return res.json({
                    status: 200,
                    data: data
                })
            }

        }
    })
}
exports.findAllJob = async (req, res) => {
    jobsModel.find({ isDelete: false }, (err, data) => {
        if (err) {
            return res.json({
                status: 500,
                message: "Some thing is wrong"
            })
        }
        else {
            // console.log("data", data)
            return res.json({
                status: 200,
                data: data
            })
        }
    })
}
exports.deleteOneJob = async (req, res) => {
    const data = req.body;
    var id = data.id;
    if (id == null || id == "" || id == undefined) {
        return res.json({
            status: 400,
            message: "Please Enter JOb ID"
        })
    }
    jobsModel.findOneAndUpdate({ _id: id },{$set:{isDelete:true}},(err, data) => {
        if (err) {
            return res.json({
                status: 500,
                message: "Some thing is wrong"
            })
        }
        else {
            console.log("data",data);
                return res.json({
                    status: 200,
                    message: "JOb Successfully Deleted"
                })

        }
    })
}
exports.deleteJob = async (req, res) => {
    const data = req.body;
    var id = data.id;
    if (id == null || id == "" || id == undefined) {
        return res.json({
            status: 400,
            message: "Please Enter JOb ID"
        })
    }
    jobsModel.updateMany({ _id: id },{$set:{isDelete:true}},(err, data) => {
        if (err) {
            return res.json({
                status: 500,
                message: "Some thing is wrong"
            })
        }
        else {
            console.log("data",data);
                return res.json({
                    status: 200,
                    message: "JOb Successfully Deleted"
                })

        }
    })
    // jobsModel.findAAndUpdate({ _id: id },{$set:{isDelete:true}},(err, data) => {
    //     if (err) {
    //         return res.json({
    //             status: 500,
    //             message: "Some thing is wrong"
    //         })
    //     }
    //     else {
    //         console.log("data",data);
    //             return res.json({
    //                 status: 200,
    //                 message: "JOb Successfully Deleted"
    //             })

    //     }
    // })
}
exports.updateJobdetails = async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
          return res.json(err);
        } else {
          var files = req.files;
          console.log("files", files);
          if (files !== null) {
              let resume = req.files.resume[0].path;
              let profile = req.files.profile[0].path;
            // console.log("profile",profile,resume);
            //   var image_url = process.env.HOST + files.path;
            //   var fileName = files.name;
              var data = req.body;
              var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
              jobsModel.findById(data.id,(err,datafind)=>{
                if (err) {
                    return res.json({
                        status: 500,
                        message: "Some thing is wrong"
                    })
                }else {
              console.log("data", data);
              var name = data.name;
              var mobileNumer = data.mobile_number;
              var email= data.email;
              if (name == null || name == "" || name == undefined) {
                  return res.json({
                      status: 404,
                      message: "Please Enter Name"
                  })
              }
              if (mobileNumer == null || mobileNumer == "" || mobileNumer == undefined) {
                  return res.json({
                      status: 404,
                      message: "Please Enter mobileNumer"
                  })
              }else if(isNaN(mobileNumer)){
                return res.json({
                    status: 404,
                    message: "Please Enter mobileNumer"
                })
              }
              if (email == null || email == "" || email == undefined) {
                
                return res.json({
                    status: 404,
                    message: "Please Enter email"
                })
            } else if(!emailRegex.test(email)){
                return res.json({
                    status: 404,
                    message: "Please Enter valid email"
                })
            }
            const updateData={name:data.name,profile:profile,resume:resume,email:data.email,technical_skill:data.technical_skill,mobile_number:mobileNumer};
            console.log(updateData,data.id)
              jobsModel.findOneAndUpdate({_id:data.id},{$set:updateData},(err,updateData)=>{
                if (err) {
                    return res.json({
                        status: 500,
                        message: "Some thing is wrong"
                    })
                }
                else{
                    console.log(updateData)
                    return res.json({
                        status:200,
                        message:"Book Details successfully updated"
                    })
                }
            });

            //   data.save((err, saveData) => {
            //       if (err) {
            //         console.log("save error", err)
            //           return res.json({
            //               status: 500,
            //               message: "Some thing is wrong"
            //           })
            //       }
            //       else {
            //           return res.json({
            //               status: 200,
            //               message: "Data Successfully Created"
            //           })
            //       }
            //   });
        }
          
        
      });
    }
    }
});
}
exports.searchJob = async (req, res) => {
    const data = req.query;
    let query={};
    if(!!data.name){
        // query.name=data.name;
        query= { $or: [ { name:data.name }, { technical_skill:data.name} ] };
    }
    query.isDelete=false;
    // var id = data.id;
    
    jobsModel.find(query, (err, data) => {
        if (err) {
            return res.json({
                status: 500,
                message: "Some thing is wrong"
            })
        }
        else {
            // console.log("data", data)
            return res.json({
                status: 200,
                data: data
            })
        }
    })
}