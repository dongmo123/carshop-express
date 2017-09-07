var express = require('express');
var router = express.Router();
var user = require('../base/base.js').user;
var car = require('../base/base.js').car;
/* GET users listing. */
router.get('/create', function(req, res, next) {
    res.render('users/reg');
});
router.get('/update/:_id', function(req, res, next) {
    user.findOne(req.params, function(err, data) {
        console.log(data.toString());
        if (err) {
            res.end('查询失败');
        } else {
            //res.send('查询成功：'+data.toString());
            //查询到数据是对象数组样式的集合
            //查询不到是null
            if (data) {
                //查到数据
                res.render('users/update', {
                    data: data,
                    admin: req.session.admin,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            } else {
                //没有数据返回null
                res.send('没有此数据');
            }
        }
    });
});
router.post('/create', function(req, res) {
    //在服务器端自动的给用户的数据添加注册时间
    req.body.addtime = new Date();
    req.body.uptime = new Date();
    //获取用户注册的ip
    req.body.ip = req.ip;
    //给密码加密
    //md5
    req.body.password = require('../models/model').md5(req.body.password);
    req.body.img = 'initlogo.png';
    req.body.hobby = '';
    req.body.sex = '';
    req.body.tel = '';
    req.body.email = '';
    req.body.age = '';
    console.log(req.body);
    //console.log(req.body);
    user.create(req.body, function(err) {
        if (err) {
            res.redirect('back');
        } else {
            user.findOne(req.body, function(err, data) {
                if (err) {
                    res.send('自动登录异常');
                } else {
                    if (data) {
                        req.session.admin = data;
                        req.flash('success', '登录成功');
                        res.redirect('/');
                    } else {
                        res.redirect('/');
                    }
                }
            });
        }
    });
});

router.get('/list', function(req, res) {
    var where = {};
    if (req.query.username) {
        where = {
            username: req.query.username
        }
    }
    /*if (req.query.age) {
        where = {
            age: Number(req.query.age)
        }
    }*/
    // 年龄处理
    if (req.query.minage) {
        where.age = {
            $gt: Number(req.query.minage)
        }
    }
    if (req.query.maxage) {
        where.age = {
            $lt: Number(req.query.maxage)
        }
    }
    // 年龄必须在25到40之间
    if (req.query.minage && req.query.maxage) {
        where.age = {
            $lt: Number(req.query.maxage),
            $gt: Number(req.query.minage)
        }
    }


    // 没有页数page参数的时候，给page默认为1
    if (!req.query.page) {
        req.query.page = 1;
    }


    //查询总条数
    user.count(function(err, total) {
        if (err) {
            res.send('查询失败');
        } else {
            //查询成功，得到总条数 total,设计每页5条信息，向上取整加一
            var maxpage = Math.ceil(total / 5);
            //将这些数据计入search
            req.query.total = total;
            req.query.maxpage = maxpage;
            //跳过的信息条数,并计入search
            var num = 5 * (req.query.page - 1);
            req.query.num = num;

            user.find(function(err, data) {
                if (err) {
                    res.send('服务器内部问题');
                } else {
                    res.render('users/list', {
                        data: data,
                        successlogo: req.flash('successlogo').toString(),
                        errorlogo: req.flash('errorlogo').toString(),
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString(),
                        admin: req.session.admin,
                        search: req.query
                    });
                }

            }).where(where).limit(5).sort().skip(num);
        }
    });
});

//汽车列表页

router.get('/carlist', function(req, res) {
    var where = {};
    if (req.query.carname) {
        where = {
            carname: req.query.carname
        }
    }

    // 价格处理
    if (req.query.minprice) {
        where.age = {
            $gt: Number(req.query.minprice)
        }
    }
    if (req.query.maxprice) {
        where.age = {
            $lt: Number(req.query.maxprice)
        }
    }
    // 年龄必须在25到40之间
    if (req.query.minprice && req.query.maxprice) {
        where.age = {
            $lt: Number(req.query.maxprice),
            $gt: Number(req.query.minprice)
        }
    }
    // 没有页数page参数的时候，给page默认为1
    if (!req.query.page) {
        req.query.page = 1;
    }
    //查询总条数
    car.count(function(err, total) {
        if (err) {
            res.send('查询失败');
        } else {
            //查询成功，得到总条数 total,设计每页5条信息，向上取整加一
            var maxpage = Math.ceil(total / 5);
            //将这些数据计入search
            req.query.total = total;
            req.query.maxpage = maxpage;
            //跳过的信息条数,并计入search
            var num = 5 * (req.query.page - 1);
            req.query.num = num;

            car.find(function(err, data) {
                if (err) {
                    res.send('服务器内部问题');
                } else {
                    res.render('users/carlist', {
                        data: data,
                        successlogo: req.flash('successlogo').toString(),
                        errorlogo: req.flash('errorlogo').toString(),
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString(),
                        admin: req.session.admin,
                        search: req.query
                    });
                }

            }).where(where).limit(5).sort().skip(num);
        }
    });
});



router.get('/remove1/:_id', function(req, res) {
    user.remove(req.params, function(err) {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('back');
        }
    });
});
router.get('/removecar/:_id', function(req, res) {
    car.remove(req.params, function(err) {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect('back');
        }
    });
});
//将修改的用户信息保存
router.post('/update/:_id', function(req, res) {
    req.body.uptime = new Date();
    user.update(req.params, {
        $set: req.body
    }, function(err) {
        if (err) {
            req.flash('error', '修改失败');
            res.redirect('back');
        } else {
            req.session.admin.username = req.body.username;
            req.flash('success', '保存成功');
            res.redirect('back');
        }
    });
});
//上传图片
var multer = require('multer');
var upload = multer({
    dest: 'public/upload'
}); //设置上传的目录为/public/upload
router.get('/image/:_id', function(req, res) {
    console.log(req.params);
    res.render('users/image', req.params);
});
router.post('/image', upload.single('img'), function(req, res) {
    //res.send('sc');
    console.log(req.body, req.file);
    //上传后先修改文件名
    var fs = require('fs');
    var oldname = req.file.path;
    var path = require('path');

    var filetype = path.extname(req.file.originalname);
    var newname = req.file.path + filetype;
    //console.log(newname);
    fs.rename(oldname, newname, function(err) {
        if (err) {
            res.send('文件名修改失败');
        } else {
            //查找该用户的图像
            user.findOne(req.body, function(err, data) {
                console.log(data.img);
                if (err) {
                    req.flash('error', '修改异常，找不到数据');
                    //console.log('修改异常，找不到数据', err);
                    res.redirect('/users/list');
                } else {
                    //更新头像
                    user.update(req.body, {
                            $set: {
                                img: req.file.filename + filetype
                            }
                        },
                        function(err) {
                            if (err) {
                                res.redirect('back');
                            } else {
                                req.flash('success', '头像修改成功');
                                req.session.admin.img = req.file.filename + filetype;
                                res.redirect('/');

                            }
                        }
                    );
                    //找到原头像数据，如果不是初始图像，就删除
                    if (data.img !== 'initlogo.png') {
                        fs.unlink('public/upload/' + data.img, function(err) {
                            if (err) {
                                req.flash('errorlogo', '原头像删除失败');
                                //console.log('原头像删除失败', err);
                                res.redirect('/users/list');
                            } else {
                                req.flash('successlogo', '原头像删除成功');
                                //console.log('原头像删除成功');
                            }
                        });
                    }

                }
            });

        }
    });

});


//修改汽车照片

//将修改的用户信息保存

//上传图片
var multer = require('multer');
var uploads = multer({
    dest: 'public/upload/cars'
}); //设置上传的目录为/public/upload/cars
router.get('/carimage/:_id', function(req, res) {
    console.log(req.params);
    res.render('users/carimage', req.params);
});
router.post('/carimage', uploads.single('img'), function(req, res) {
    //res.send('sc');
    console.log(req.body, req.file);
    //上传后先修改文件名
    var fs = require('fs');
    var oldname = req.file.path;
    var path = require('path');

    var filetype = path.extname(req.file.originalname);
    var newname = req.file.path + filetype;
    //console.log(newname);
    fs.rename(oldname, newname, function(err) {
        if (err) {
            res.send('文件名修改失败');
        } else {
            //查找该用户的图像
            car.findOne(req.body, function(err, data) {
                console.log(data.img);
                if (err) {
                    req.flash('error', '修改异常，找不到数据');
                    //console.log('修改异常，找不到数据', err);
                    res.redirect('/users/carlist');
                } else {
                    //更新头像
                    car.update(req.body, {
                            $set: {
                                img: req.file.filename + filetype
                            }
                        },
                        function(err) {
                            if (err) {
                                res.redirect('back');
                            } else {
                                req.flash('success', '照片修改成功');
                                res.redirect('/users/carlist');

                            }
                        }
                    );
                    //找到原头像数据，如果不是初始图像，就删除
                    if (data.img !== 'initlogo.png') {
                        fs.unlink('public/upload/cars/' + data.img, function(err) {
                            if (err) {
                                req.flash('errorlogo', '原照片删除失败');
                                //console.log('原头像删除失败', err);
                                res.redirect('/users/carlist');
                            } else {
                                req.flash('successlogo', '原照片删除成功');
                                //console.log('原头像删除成功');
                            }
                        });
                    }

                }
            });

        }
    });

});
// 退出 => 删除session中的值
router.get('/logout', function(req, res) {
    req.session.admin = null;

    res.redirect('/');
});
//密码重置
router.get('/uppass/:_id', function(req, res) {
    res.render('users/uppass', {
        data: req.params,
        error: req.flash('error').toString()
    });
});
router.post('/uppass', function(req, res) {
    console.log(req.body);
    /* { _id: '596839c4767136e9dae5d08b',
          password: 'wqeqw',
          repassword: 'eqweqw' }*/
    if (req.body.password == req.body.repassword && req.body.password !== '') {
        //加密处理
        req.body.password = require('../models/model').md5(req.body.password);
        user.update({
            _id: req.body._id
        }, {
            $set: {
                password: req.body.password
            }
        }, function(err) {
            if (err) {
                req.flash('error', '密码重置失败！');
                res.redirect('back');
            } else {
                req.flash('error', '密码重置成功！');
                res.redirect('back');

            }
        });
    } else {
        req.flash('error', '密码不一致或为空，请重新填写');
        res.redirect('back');
    }
});
router.get('/addcar', function(req, res) {
    res.render('users/addcar', {
        admin: req.session.admin,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});


router.post('/addcar', function(req, res) {
    req.body.img = 'initlogo.png';
    console.log(req.body);
    car.create(req.body, function(err) {
        if (err) {
            req.flash('error', '添加失败');
            res.redirect('back');
        } else {
            req.flash('success', '添加成功');
            res.redirect('back');

        }
    });
});



module.exports = router;