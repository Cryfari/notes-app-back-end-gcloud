const ExportNotesPlayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportValidator = {
  validateExportNotesPayload: (payload) => {
    const validationResult = ExportNotesPlayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.message);
    }
  },
};

module.exports = ExportValidator;
