import controller from '../controllers/user.controller';

const routes = (router) => {
  const prefix = `${process.env.API_BASE}users`;

  router.get(`${prefix}`, (req, res) => {
    controller.index(req, res);
  });

  router.post(`${prefix}`, (req, res) => {
    controller.store(req, res);
  });

  router.get(`${prefix}/:id`, (req, res) => {
    controller.show(req, res);
  });

  router.put(`${prefix}/:id`, (req, res) => {
    controller.update(req, res);
  });

  router.delete(`${prefix}/:id`, (req, res) => {
    controller.destroy(req, res);
  });
};

export default routes;
