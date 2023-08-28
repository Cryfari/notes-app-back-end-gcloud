const ClientError = require('../../exceptions/ClientError');
/**
 * export handler
 */
class ExportsHandler {
  /**
   * @param {service} service
   * @param {validator} validator
   * @param {string} topicName
   */
  constructor(service, validator, topicName) {
    this._service = service;
    this._validator = validator;
    this._topicName = topicName;

    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  /**
   * @param {request} request
   * @param {hapi} h
   */
  async postExportNotesHandler(request, h) {
    try {
      this._validator.validateExportNotesPayload(request.payload);

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };

      await this._service.sendMessage(this._topicName, JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ExportsHandler;
