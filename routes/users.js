var express = require('express');
var router = express.Router();
const User = require('../model/user');
var getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
router.post('/register', (req, res) => {
    var www = /\bwww./;
    var http = /\bhttp:\/\//;
    var https = /\bhttps:\/\//;
    var bodyBaseDomain = req.body.baseDomain.replace(https, "");
    bodyBaseDomain = bodyBaseDomain.replace(http, "");
    bodyBaseDomain = bodyBaseDomain.replace(www, "");
    var data = new User({
        'email': req.body.email,
        'secretKey': req.body.secretKey,
        'baseDomain': bodyBaseDomain
    });
    console.log(data);
    if ((!data.email) || data.email == '' || (!data.baseDomain) || data.baseDomain == '')
        return res.status(200).json({ status: false, message: 'Req body error! Email or domain not found' });
    User.findOne({ 'baseDomain': req.body.baseDomain }).then(oldUser => {

        if (oldUser)
            res.status(200).json({ status: false, message: 'account already exists' });
        else {
            /*var secret = [];
            for (i = 0; i < 6; i++) {
                switch (Math.floor(Math.random() * 10) % 3) {
                    case 0:
                        secret.push(String.fromCharCode(getRandomInt(65, 90)));
                        break;
                    case 1:
                        secret.push(String.fromCharCode(getRandomInt(97, 122)));
                        break;
                    case 2:
                        secret.push(getRandomInt(0, 9));
                        break;
                }
            }
            data.secretKey = secret.join('');*/
            data.save().then(newUser => {
                res.status(200).json({ status: true, message: 'account created' });
            }).catch(err => {
                console.log('User Not Saved ', err);
                res.status(401).json({ status: false, message: err });
            })
        }
    }).catch(err => {
        console.log('User Not Saved');
        res.status(401).json({ status: false, message: 'Database error' });
    });

});

/* GET users listing. */
router.get('/visit', function(req, res, next) {
    //console.log(req)
    var url = req.headers.referer;
    var www = /\bwww./;
    var http = /\bhttp:\/\//;
    var https = /\bhttps:\/\//;
    url = url.replace(http, "");
    url = url.replace(https, "");
    url = url.replace(www, "");
    var bodyIp = req.headers['x-forwarded-for'];
    console.log(bodyIp);
    var bodyBaseDomain = url.split(/\/(.+)/)[0];
    var bodyPath = url.split(/\/(.+)/)[1];
    console.log(bodyBaseDomain, bodyPath);

    if (!url) {
        return res.status(200).json({ status: false, message: 'Req body error! domain not found' });
    }
    User.findOne({ 'baseDomain': bodyBaseDomain }, (err, oldUser) => {
        if (err)
            return res.status(401).json({ status: false, message: err });
        if (!oldUser) {
            return res.status(200).json({ status: false, message: 'user not found' });
        }
        var path = oldUser.paths.find((x) => {
            return x.path == bodyPath;
        });
        var newPaths = oldUser.paths.filter(x => {
            return x.path != bodyPath;
        })
        if (path) {
            path.totalVisitorCount++;
            //console.log(path.visitors[bodyIp]);
            if (path.visitors[bodyIp]) {

                //console.log("aa ", path.visitors[bodyIp]);
                path.visitors[bodyIp] += 1;
                // console.log("bb ", path.visitors[bodyIp]);
            } else {
                path.visitors[bodyIp] = 1;
            }

        } else {
            path = {
                'path': bodyPath,
                'totalVisitorCount': 1,
                'visitors': {}
            };
            //console.log(path.visitors);
            path.visitors[bodyIp] = 1


        }
        //console.log("cc ", path.visitors[bodyIp]);
        //console.log(newPaths);
        newPaths.push(path);
        //console.log("dd ", newPaths);
        //oldUser.paths = newPaths;
        //console.log("ee ", oldUser.paths);
        User.findOneAndUpdate({ 'baseDomain': bodyBaseDomain }, { $set: { paths: newPaths } }).then(newUser => {
            //console.log("ff ", newUser.paths);
            res.status(200).json({ status: true, message: 'visit success', totalVisitorCount: path.totalVisitorCount });
        }).catch(err => {
            res.status(200).json({ status: false, message: 'error in saving' });
        });
    });

});

router.post('/getUserData', function(req, res, next) {
    console.log(req.body);
    var url = req.body.baseDomain;
    var www = /\bwww./;
    var http = /\bhttp:\/\//;
    var https = /\bhttps:\/\//;
    url = url.replace(http, "");
    url = url.replace(https, "");
    url = url.replace(www, "");
    console.log(req.body.email, url);
    if ((!req.body.email) || (!url)) {
        return res.status(200).json({ status: false, message: 'req body error' });
    }
    User.findOne({ 'baseDomain': url }, (err, user) => {
        if (err)
            return res.status(200).json({ status: false, message: 'error in searching user' });
        if (user) {
            delete user.secretKey;
            res.status(200).json({ status: true, message: 'user found', data: user });

        } else {
            res.status(200).json({ status: false, message: 'user not exist' });

        }

    })

});


router.get('/', function(req, res, next) {
    console.log(req);
    res.send('respond with a resource');
});

module.exports = router;