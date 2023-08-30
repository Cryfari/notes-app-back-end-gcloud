const {Storage} = require('@google-cloud/storage');

const storage = new Storage();
/**
 * storage service
 */
class StorageService {
  /**
   * constructor
   */
  constructor() {
    this._bucket = storage.bucket(process.env.BUCKET_NAME);
  }

  /**
   * @param {readable} file
   * @param {object} meta
   * @return {object}
   */
  async writeFile(file, meta) {
    const extention = meta.filename.split('.').pop();
    const filename = +new Date() + '.' + extention;
    const destFileName = 'file/images/' + filename;
    const fileBucket = this._bucket.file(destFileName);
    await file.pipe(fileBucket.createWriteStream()).on('finish', async () => {
      await this._bucket.file(destFileName).makePublic();
    });
    return filename;
  }
}

module.exports = StorageService;
