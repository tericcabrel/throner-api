import controller from '../controllers/position.controller';

const routes = (router) => {
  const prefix = `${process.env.API_BASE}positions`;

  router.post(`${prefix}`, (req, res) => {
    return controller.create(req, res);
  });

  /* router.put(`${prefix}/:id`, (req, res) => {
    return controller.update(req, res);
  }); */

  router.delete(`${prefix}/:id`, (req, res) => {
    return controller.delete(req, res);
  });

  router.get(`${prefix}/:id`, (req, res) => {
    return controller.getById(req, res);
  });

  router.get(`${prefix}`, (req, res) => {
    return controller.getAll(req, res);
  });
};

export default routes;
