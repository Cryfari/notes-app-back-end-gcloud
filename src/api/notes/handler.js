/**
 * handler untuk note
 */
class NotesHandler {
  /**
   * @param {any} service
   */
  constructor(service) {
    this._service = service;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  /**
   * @param {request} request
   * @param {any} h
   * @return {response} response
   */
  postNoteHandler(request, h) {
    try {
      const {title = 'untitled', body, tags} = request.payload;

      const noteId = this._service.addNote({title, body, tags});

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });

      response.code(500);
      return response;
    }
  }

  /**
   * @return {response} response
   */
  getNotesHandler() {
    const notes = this._service.getNotes();
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  /**
   * @param {request} request
   * @param {any} h
   * @return {response} response
   */
  getNoteByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const note = this._service.getNoteById(id);
      return {
        status: 'success',
        data: {
          note,
        },
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }

  /**
   * @param {request} request
   * @param {any} h
   * @return {response} response
   */
  putNoteByIdHandler(request, h) {
    try {
      const {id} = request.params;

      this._service.editNoteById(id, request.payload);
      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }

  /**
   * @param {request} request
   * @param {any} h
   * @return {response} response
   */
  deleteNoteByIdHandler(request, h) {
    try {
      const {id} = request.params;

      this._service.deleteNoteById(id);

      return {
        status: 'success',
        message: 'Catatan berhasil dihapus',
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }
}

module.exports = NotesHandler;
