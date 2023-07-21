const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * logika untuk fungsi notes
 */
class NotesService {
  /**
   * untuk menyimpan semua note
   */
  constructor() {
    this._notes = [];
  }
  /**
   * untuk menambahkan note
   * @param {string} title
   * @param {string} body
   * @param {string} tags
   * @return {string} id
   */
  addNote({title, body, tags}) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
      title, tags, body, id, createdAt, updatedAt,
    };

    this._notes.push(newNote);

    const isSuccess = this._notes.filter((note) => note.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return id;
  }

  /**
   * mengambil semua notes
   * @return {array} notes
   */
  getNotes() {
    return this._notes;
  }

  /**
   * mengambil note dengan id
   * @param {string} id
   * @return {array} note
   */
  getNoteById(id) {
    const note = this._notes.filter((n) => n.id === id)[0];

    if (!note) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return note;
  }

  /**
   * edit note dengan id
   * @param {string} id
   * @param {string} title
   * @param {string} body
   * @param {string} tags
   */
  editNoteById(id, {title, body, tags}) {
    const index = this._notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }

    const updatedAt = new Date().toISOString();

    this._notes[index] = {
      ...this._notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
  }


  /**
   * menghapus note dengan id
   * @param {string} id
   */
  deleteNoteById(id) {
    const index = this._notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }

    this._notes.splice(index, 1);
  }
}

module.exports = NotesService;
