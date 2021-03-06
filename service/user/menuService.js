const { sequelize, MenuModel } = require('../../models');
const { success, error } = require('../../utils/notice');

module.exports = {
  list: async (req, res, next) => {
    try {
      await MenuModel.findAll().then(data => {
        const list = data.filter((item) => item.parentId === '');
        list.forEach((item, index) => {
          list[index] = {
            ...JSON.parse(JSON.stringify(item)),
            children:data.filter(user => item.id == user.parentId),
          }
        })
        res.json(success(list, '查询成功'));
      })
    } catch (e) {
      next(e)
    }
  },
  create: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      await MenuModel.findOrCreate(
        {
          where: {
            code: req.body.code,
          },
          defaults: req.body,
          transaction: t,
        }
      ).then(([data, created]) => {
        if (!created) {
          res.json(error(data, '编码不能重复'))
        } else {
          res.json(success(data, '创建成功'))
        }
      })
      await t.commit();
    } catch (e) {
      await t.rollback();
      next(e)
    }
  }
}
