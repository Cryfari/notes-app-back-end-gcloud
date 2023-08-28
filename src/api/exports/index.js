const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, {service, validator, topicName}) => {
    const exportsHandler = new ExportsHandler(service, validator, topicName);
    server.route(routes(exportsHandler));
  },
};
