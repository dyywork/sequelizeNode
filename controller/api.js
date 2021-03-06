

module.exports = (app) => {
  app.use('/api/user', require('./system/userController'));
  app.use('/api/list', require('./system/listController'));
  app.use('/api/menu', require('./system/parentMenuController'));
  app.use('/api/subMenu', require('./system/subMenuController'));
  app.use('/api/system', require('./system/dutyController'));
  app.use('/api/system', require('./system/roleController'));
  app.use('/api/menu', require('./system/menuController'));
};

