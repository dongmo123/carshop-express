var express = require('express');
var router = express.Router();
var user = require('../base/base').user;
var car = require('../base/base').car;
/* GET home page. */
router.get('/', function(req, res, next) {
    car.find(function(err, data) {
        if (err) {
            res.send('服务器链接错误');
        } else {
            res.render('index', {
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                admin: req.session.admin,
                data: data
            });
        }
    }).limit(8);

});

router.get('/login', function(req, res, next) {
    res.render('login', {
        error: req.flash('error').toString()
    });
});
router.get('/maintain', function(req, res, next) {
    res.render('maintain', {
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        admin: req.session.admin
    });
});
router.get('/repairs', function(req, res, next) {
    res.render('repairs', {
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        admin: req.session.admin
    });
});
router.get('/contact', function(req, res, next) {
    res.render('contact', {
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        admin: req.session.admin
    });
});
router.get('/details/:_id', function(req, res, next) {
    console.log(req.params);
    car.findOne(req.params, function(err, data) {
        if (err) {
            res.send('服务器链接错误');
        } else {
            console.log(data.toString());
            res.render('details', {
                admin: req.session.admin,
                data: data
            });
        }
    });
});

router.post('/login', function(req, res) {
    req.body.password = require('../models/model').md5(req.body.password);
    console.log(req.body);
    user.findOne(req.body, function(err, data) {
        if (err) {
            res.send('查询失败');
        } else {
            if (data) {
                req.session.admin = data;
                req.flash('success', '登录成功');
                res.redirect('/');
            } else {
                req.flash('error', '用户名密码不正确');
                res.redirect('back');
            }
        }
    });
});

module.exports = router;