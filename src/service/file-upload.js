const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3');

const s3 = new aws.S3();


aws.config.update({
    secretAccessKey: 'Hxvcfrup+D+uIHMnCVrjvSGFNwmYPpGmflHz+w7K', // AKIAJ6DIVLW64ZTMIWJQ
    accessKeyId: 'AKIAJ6DIVLW64ZTMIWJQ', // Hxvcfrup+D+uIHMnCVrjvSGFNwmYPpGmflHz+w7K
    region: 'us-east-2'
});


let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'imageuploadcv',
        acl: 'public-read',
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function(req, file, cb) {
            cb(null, Date.now().toString() + ".jpg");
        }
    })
})


module.exports = upload;