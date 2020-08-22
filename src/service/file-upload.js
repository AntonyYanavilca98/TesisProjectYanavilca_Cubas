const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3');

const s3 = new aws.S3();

require('dotenv').config();

aws.config.update({
    secretAccessKey: process.env.awssecretAccessKey,
    accessKeyId: process.env.awsaccessKeyId,
    region: process.env.awsregion
});


let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.awsbucket,
        acl: process.env.awsacl,
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function(req, file, cb) {
            cb(null, Date.now().toString() + ".jpg");
        }
    })
})


module.exports = upload;