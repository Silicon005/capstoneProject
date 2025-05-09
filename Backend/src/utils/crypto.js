const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Convert hex to 32-byte Buffer
if (secretKey.length !== 32) {
    throw new Error('Encryption key must be 32 bytes long');
  }
  
const encrypt = (text) => {
  const iv = crypto.randomBytes(16); // Move iv inside the function
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (text) => {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
};

module.exports = { encrypt, decrypt };
