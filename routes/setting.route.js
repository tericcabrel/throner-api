import controller from '../controllers/setting.controller';

const routes = (router) => {
  const prefix = `${process.env.API_BASE}settings`;

  router.get(`${prefix}`, (req, res) => {
    return controller.getAll(req, res);
  });
};

export default routes;
