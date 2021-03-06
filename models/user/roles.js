'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * 定义关联的辅助方法。
     * 此方法不是Sequelize生命周期的一部分。
     * 模型/索引文件将自动调用此方法。
     */
    static associate(models) {
      // 在这里定义关联
      const {Duty, Roles} = models;
      Roles.belongsToMany(Duty, {through: 'rolesDuty', as: 'children'})
      // sequelize.sync({alter: true})
    }
  };
  Roles.init({
    code: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '职责编码不能为空'
        }
      }
    },
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    creator: DataTypes.STRING,
    creatorId: DataTypes.STRING,
    status: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue:new Date(),
      get(){
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue:new Date(),
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    sequelize,
    timestamps: true,
    modelName: 'Roles',
  });
  // (async () => {
  //   await Roles.sync({ alter: true })
  // })()
  return Roles;
};
