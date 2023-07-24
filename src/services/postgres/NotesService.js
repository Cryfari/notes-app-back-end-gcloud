const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const {mapDBToModel} = require('../../utils');

/**
 * service notes
 */
class NotesService {
  /**
   * constructor
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * untuk menambahkan note
   * @param {string} title
   * @param {string} body
   * @param {string} tags
   * @param {string} owner
   * @return {string} id
   */
  async addNote({title, body, tags, owner}) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
   * mengambil semua notes
   * @param {string} owner
   * @return {array} notes
   */
  async getNotes(owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE owner = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  /**
   * mengambil note dengan id
   * @param {string} id
   * @return {array} note
   */
  async getNoteById(id) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  /**
   * edit note dengan id
   * @param {string} id
   * @param {string} title
   * @param {string} body
   * @param {string} tags
   */
  async editNoteById(id, {title, body, tags}) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE notes '+
        'SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 '+
        'RETURNING id',
      values: [title, body, tags, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
  }

  /**
   * menghapus note dengan id
   * @param {string} id
   */
  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }

  /**
   * @param {string} id
   * @param {string} owner
   */
  async verifyNoteOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = NotesService;
