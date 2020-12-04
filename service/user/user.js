const fs = require('fs');
const xlsx = require('node-xlsx');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const {Op} = Sequelize;
const {User} = require('../../models');

module.exports = {
  userList: async (req, res, next) => {
    try {
      const {page, size, userName, name} = req.query;
      await User.findAndCountAll({
        where: {
          [Op.or]: [
            {
              userName: {
                [Op.like]:`%${userName}%`,
              }
            },
            {
              name: {
                [Op.like]:`%${name}%`,
              }
            }
          ]
        },
        limit: Number(size),
        offset: Number(page-1)* Number(size)}).then(list => {
        res.json({
          message: '查询成功',
          list: {
            ...list,
            page: Number(page),
            size: Number(size),
          }
        })
      })
    }
    catch (err) {
      next();
    }
  },
  uploadHeaderImg: async (req, res, next) => {
    try {
      fs.renameSync(req.file.path, `uploads/${req.body.id}${req.file.originalname}`);
      await User.update({url: `http://${req.headers.host}/uploads/${req.body.id}${req.file.originalname}`}, {where: {id:req.body.id}}).then(files => {
        res.json({
          msg: '成功',
          data: files,
        })
      })
    }
    catch (err) {
      next();
    }
  },
  exportUserList: async (req, res, next) => {
    try {
      const {userName, name} = req.query;
      await User.findAll({
        where: {
          [Op.or]: [
            {
              userName: {
                [Op.like]:`%${userName}%`,
              }
            },
            {
              name: {
                [Op.like]:`%${name}%`,
              }
            }
          ]
        },
      }).then(list => {
        const dataList = [];
        const titleList = ['用户名', '密码', '邮箱'];
        dataList.push(titleList);
        list.forEach(item => {
          const arr = [];
          arr.push(item.userName);
          arr.push(item.password);
          arr.push(item.email);
          dataList.push(arr);
        })
        const buffer = xlsx.build([{name: 'sheet1', data: dataList}]);
        const name = `user${new Date().toLocaleDateString()}`
        fs.writeFileSync(`./uploads/${name}.xlsx`, buffer, {'flag': 'w'});
        res.download(`./uploads/${name}.xlsx`);
      })
    }
    catch (e) {
      next()
    }
  },
  createUser: async (req, res, next) => {
    try {
      await User.findOrCreate({where: {userName: req.body.userName}, defaults: {...req.body, status: 'ok'}}).then(([user, created]) => {
        if (created) {
          res.json({
            message: '创建成功',
            user
          });
        }
        res.json({
          message: '用户名已经存在',
        });
      });
    }
    catch (err) {
      next();
    }
  },
  deleteUser: async (req, res, next) => {
    try{
      const {id} = req.params;
      await User.destroy({where: {id}, force: true}).then(user => {
        res.json({
          message: '删除成功',
        })
      })
    }
    catch (err) {
      next();
    }
  },
  updateUser: async (req, res, next) => {
    try {
      await User.update(req.body, {where: {id:req.body.id}}).then(user => {
        res.json({
          message: '更新成功',
          user,
        })
      })
    }
    catch (err) {
      next();
    }
  },
  getUserDetails: async (req, res, next) => {
    try {
      const {id} = req.params;
      await User.findByPk(id).then(user => {
        res.json({
          message: '查询成功',
          user,
        })
      })
    }
    catch (err) {
      next();
    }
  },
  login: async (req, res, next) => {
    try{

      await User.findOne({where: {userName: req.body.userName}}).then(user => {
        if (user.password === req.body.password) {
          const token = jwt.sign({name: user.userName, id: user.id}, 'dingyongya');
          User.update({token, timeout: (new Date().getTime())+ 60*60*1000},{where:{id: user.id}}).then(() => {
            user.token = token;
            res.json({
              message: '登录成功',
              user
            })
          })
        } else {
          res.json({
            message: '用户名或密码错误',
          })
        }
      })
    }
    catch (err) {
      next(err);
    }
  }
};



/**
 * @api {POST} /user/create getUserInfof
 * @apiGroup User
 *
 * @apiParam {String} name 登aa录名1
 * @apiParamExample {json} Request-Example
 * {
 *  "userName": "Eve"
 * }
 *
 * @apiSuccessExample  {json} Response-Example
 * {
 *   "userName": "adfaafadadfadf",
 *   "createTime": "1568901681"
 *   "updateTime": "1568901681"
 * }
 */

