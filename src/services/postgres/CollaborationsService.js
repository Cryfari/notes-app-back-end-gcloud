/* eslint-disable max-len */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * colaborations service
 */
class CollaborationsService {
  /**
   * constructor
   * @param {service} cacheService
   */
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  /**
   * @param {sttring} noteId
   * @param {sttring} userId
   */
  async addCollaboration(noteId, userId) {
    const id = `colab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, noteId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    await this._cacheService.delete(`notes:${userId}`);
    return result.rows[0].id;
  }

  /**
   * @param {string} noteId
   * @param {string} userId
   */
  async deleteCollaboration(noteId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id',
      values: [noteId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
    await this._cacheService.delete(`notes:${userId}`);
  }

  /**
   * @param {string} noteId
   * @param {string} userId
   */
  async verifyCollaborator(noteId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2',
      values: [noteId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;
