var User = require('../models/user');

function getUsers(res) {
    User.find(function (err, users) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(users); // return all users in JSON format
    });
};

function createUser(res) {
    User.create(function (err, users) {        
        if (err) { // send error.
            res.send(err);
        }

        res.json(users); // return all users in JSON format
    })
};

module.exports = UserRouter = function (app, multer, mkdirp) {

    // api ---------------------------------------------------------------------
    // get all users
    app.get('/api/users', function (req, res) {
        // use mongoose to get all users in the database
        getUsers(res);
    });

    // create User and send back all users after creation
    app.post('/api/users', function (req, res) {

        // create a User, information comes from AJAX request from Angular
        User.create({
            name: req.body.name || '',
            userName: req.body.userName,
            password: req.body.secret,
            avatar: req.body.image,
            createdAt: new Date(),
            deletedAt: null,
            done: false
        }, function (err, user) {
            if (err)
                res.send(err);

            // get and return all the users after you create another
            getUsers(res);
        });

    });

    // delete a User
    app.delete('/api/users/:user_id', function (req, res) {
        User.remove({
            _id: req.params.user_id
        }, function (err, user) {
            if (err)
                res.send(err);

            getUsers(res);
        });
    });

    // File upload    
    var imageType = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'tiff', 'TIFF'];
    var filter = function (req, file, cb) {
        var ext = file.mimetype.split('/')[1];
        // First Check Mime Type
        console.log('mime check', imageType.indexOf(ext) > -1);
        if (imageType.indexOf(ext) === -1) {
            cb(null, false);
            req.uploadError = 'File type is not allowed';
            return cb(new Error(req.uploadError));
        }
        // Then check file size not > 4Mo
        console.log('size check', file.size < 4194304);
        if (file.size >= 4194304) {
            cb(null, false);
            req.uploadError = 'File max size allowed is 4Mo';
            return cb(new Error(req.uploadError));
        }
        // All tests success
        cb(null, true);
    };
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads')
        },
        filename: function (req, file, cb) {
            var ext = file.mimetype.split('/')[1];
            cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
        }
    });
    var upload = multer({storage: storage, fileFilter: filter});
    // var upload = multer({dest: './uploads'});
    var uploadOne = upload.single('file');
    var mkdirp = require('mkdirp');

    app.post('/upload', function (req, res) {
        console.log('start');
        uploadOne(req, res, function (uploadError) {
            mkdirp('./uploads', function(mkdirErr) {
                if (mkdirErr) {
                    return res.end(mkdirErr.toString());
                }
            });
            if (uploadError) {
                console.error('error', uploadError);
                return res.status(500).json({message: req.uploadError, uploadError});
                // .json({'error': uploadError});
            } else {
                console.log('done', req.file);
                return res.status(200).json({'done': req.file.fileName});
            }
        });
    });
    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
