/* eslint-disable max-len */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const bcrypt = require('bcrypt');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

/**
 * service users
 */
class UsersService {
  /**
   * constructor
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * menambahkan user baru
   * @param {string} username
   * @param {string} password
   * @param {string} fullname
   */
  async addUser({username, password, fullname}) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  /**
   * verifikasi username sudah ada atau belum
   * @param {string} username
   */
  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  /**
   * mengambil user berdasarkan id
   * @param {string} UserId
   */
  async getUserById(UserId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [UserId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  /**
   * verifikasi user credential
   * @param {string} username
   * @param {string} password
   * @return {string}
   */
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const {id, password: hashedPassword} = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }

  /**
   * @param {string} username
   */
  async getUsersByUsername(username) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
      values: [`%${username}%`],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = UsersService;
