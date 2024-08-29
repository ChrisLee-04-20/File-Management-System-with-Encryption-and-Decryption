var express = require('express');
var router = express.Router();
const upload = require('../middleware/multer.js');
const fs = require('fs');

const crypto = require('crypto');
const iv = crypto.randomBytes(16);

router.post('/encrypt_passphrase_v2', upload.single('uploaded_file'), (req, res) => {

  try {

    const uploadedFile = req.file;

    if (uploadedFile == null) {
      res.json({ "error": "file not found" })
    }

    const passphrase = req.body.passphrase;
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(passphrase).digest('base64').substr(0, 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const inputFilePath = uploadedFile.path;
    const outputFilePath = `${uploadedFile.destination}encrypted_${uploadedFile.originalname}`;

    const readStream = fs.createReadStream(inputFilePath);
    const writeStream = fs.createWriteStream(outputFilePath);

    readStream.on('data', (chunk) => {
      const encryptedChunk = cipher.update(chunk);
      writeStream.write(encryptedChunk);
    });

    readStream.on('end', () => {
      const finalChunk = cipher.final();
      writeStream.write(finalChunk);
      writeStream.end();
      console.log('File encryption completed.');
    });

    writeStream.on('finish', () => {
      console.log('Encrypted file saved:', outputFilePath);
      // delete the original unencrypted file
      fs.unlinkSync(inputFilePath)
    });

    res.json({ 'message': 'File uploaded and encrypted successfully' });

  } catch (err) {
    res.status(400).json({ 'error': err.message });
  }

});

router.post('/decrypt_passphrase_v2', upload.single('uploaded_file'), (req, res, next) => {

  try {

    const uploadedFile = req.file;

    if (uploadedFile == null) {
      res.json({ "error": "file not found" })
    }

    const passphrase = req.body.passphrase;
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(passphrase).digest('base64').substr(0, 32);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    const inputFilePath = uploadedFile.path;
    const fileName = `decrypted_${uploadedFile.originalname}`;
    const outputFilePath = `${uploadedFile.destination}${fileName}`;

    const readStream = fs.createReadStream(inputFilePath);

    let decryptedContent = '';

    readStream.on('data', (chunk) => {
      const decryptedChunk = decipher.update(chunk);
      decryptedContent += decryptedChunk;
    });

    readStream.on('end', () => {
      try {
        const finalChunk = decipher.final();
        decryptedContent += finalChunk;
        console.log('File decryption completed.');

        // Set the response headers to indicate a downloadable file
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'text/plain');

        // Send the decrypted content as the response
        res.status(201).json({
          "fileName": `${fileName}`,
          decryptedContent,
          'message': 'File uploaded and decrypted successfully'
        });
      } catch (err) {
        let errorMessage = err.message;

        if (err.code == "ERR_OSSL_EVP_BAD_DECRYPT") {
          errorMessage = "Wrong passphrase for decrypt.";
        }

        res.status(400).json({ 'error': errorMessage });
        return;
      }

    });

  } catch (err) {
    res.status(400).json({ 'error': err.message });
  }

});

// router.post('/encrypt_passphrase', upload.single('uploaded_file'), (req, res) => {

//   try {

//     const uploadedFile = req.file;
//     const blockSize = 128;
//     let totalBlock = 1;

//     if (uploadedFile == null) {
//       res.json({ "error": "file not found" })
//     }

//     const inputFilePath = uploadedFile.path;
//     const outputFilePath = `${uploadedFile.destination}encrypted_${uploadedFile.originalname}`;

//     const passphrase = req.body.passphrase;

//     const data = fs.readFileSync(inputFilePath, 'utf8');

//     if (data.length > blockSize) {
//       totalBlock = data.length / blockSize;
//     }

//     let encryptedData = '';
//     // let encryptedData = cryptoJS.AES.encrypt(data, passphrase).toString();

//     console.log(totalBlock, data.length)

//     for (let i = 0; i < totalBlock; i++) {
//       let subStringData = data.substring(i, (i + 1) * blockSize);
//       encryptedData = encryptedData + cryptoJS.AES.encrypt(JSON.stringify({ subStringData }), passphrase).toString();
//     }

//     console.log(encryptedData)

//     fs.writeFileSync(outputFilePath, encryptedData, 'utf8');

//     // delete the original unencrypted file
//     fs.unlinkSync(inputFilePath)

//     res.json({ 'message': 'File uploaded and encrypted successfully' });

//   } catch (err) {
//     res.status(400).json({ 'error': err.message });
//   }

// });

// router.post('/decrypt_passphrase', upload.single('uploaded_file'), (req, res) => {

//   try {
//     const uploadedFile = req.file;
//     const blockSize = 128;
//     let totalBlock = 1;

//     if (uploadedFile == null) {
//       res.json({ "error": "file not found" })
//     }

//     const inputFilePath = uploadedFile.path;
//     const outputFilePath = `${uploadedFile.destination}decrypted_${uploadedFile.originalname}`;

//     const passphrase = req.body.passphrase;

//     const data = fs.readFileSync(inputFilePath, 'utf8');

//     if (data.length > blockSize) {
//       totalBlock = data.length / blockSize;
//     }

//     let decryptedData = '';

//     for (let i = 0; i < totalBlock; i++) {
//       let subStringData = data.substring(i, (i + 1) * blockSize);
//       decryptedData = decryptedData + cryptoJS.AES.decrypt(subStringData, passphrase).toString(cryptoJS.enc.Utf8);
//     }

//     // const decryptedData = cryptoJS.AES.decrypt(data, passphrase).toString(cryptoJS.enc.Utf8);
//     console.log(decryptedData)

//     fs.writeFileSync(outputFilePath, decryptedData, 'utf8');

//     res.json({ 'message': 'File decrypted successfully' });

//   } catch (err) {
//     console.log(err)
//     res.status(400).json({ 'error': err.message });
//   }

// });

module.exports = router;