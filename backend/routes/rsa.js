var express = require('express');
var router = express.Router();
const upload = require('../middleware/multer');
const crypto = require('crypto');
const fs = require('fs');

router.get('/generate_public_key', (req, res) => {

    try {

        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            // publicKeyEncoding: {
            //     type: 'pkcs1',
            //     format: 'pem'
            // },
            // privateKeyEncoding: {
            //     type: 'pkcs1',
            //     format: 'pem'
            // }
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        // for better formatting and uses the key without any problem in the public_key_encrypt POST method
        // let formatedPublicKey = publicKey.replaceAll("\n", "\n").toString('base64');
        // let formatedPrivateKey = privateKey.replaceAll("\n", "\n").toString('base64');

        let formatedPublicKey = publicKey.toString('base64');
        let formatedPrivateKey = privateKey.toString('base64');

        res.status(201).json({
            "message": "Public key and private key are generated",
            "publicKey": formatedPublicKey,
            "privateKey": formatedPrivateKey
        })

    } catch (err) {
        res.status(401).json({ "error": err.message })
    }

});

// router.post('/public_key_encrypt_v2', upload.single("uploaded_file"), (req, res) => {

//     try {
//         const uploadedFile = req.file
//         const publicKey = req.body.publicKey;

//         if (uploadedFile == null) {
//             res.status(401).json({ "error": "Missing target file." })
//             return
//         }

//         if (publicKey == null) {
//             res.status(401).json({ "error": "Missing public key." })
//             return
//         }

//         const inputFilePath = uploadedFile.path;
//         const outputFilePath = `${uploadedFile.destination}encrypted_${uploadedFile.originalname}.enc`;

//         // read data from the file
//         const readData = fs.readFileSync(inputFilePath, { encoding: "ascii" });

//         let readBufferData = Buffer.from(readData)

//         console.log(readBufferData)

//         console.log("readBufferDataLength: " + readBufferData.length);
//         console.log("readBufferData: " + readBufferData);

//         // as a buffer
//         let encryptedData = '';

//         encryptedData = crypto.publicEncrypt({
//             key: publicKey,
//             padding: crypto.constants.RSA_PKCS1_PADDING
//         }, readBufferData);

//         console.log("encryptedDataLength: " + encryptedData.length);
//         console.log("encryptedData: " + encryptedData);

//         const encryptedBase64Data = encryptedData.toString('base64');
//         console.log("encryptedBase64DataLength: " + encryptedBase64Data.length);
//         console.log("encryptedBase64Data: " + encryptedBase64Data);

//         fs.writeFile(outputFilePath, encryptedBase64Data, 'base64', (err) => {

//         });

//         res.status(200).json({ "message": "File uploaded and encrypted successfully" })

//     } catch (err) {
//         res.status(400).json({ "error": err.message })
//     }

// })

// router.post('/public_key_decrypt_v2', upload.single("uploaded_file"), (req, res) => {

//     try {
//         const uploadedFile = req.file
//         const privateKey = req.body.privateKey;

//         if (uploadedFile == null) {
//             res.status(401).json({ "error": "Missing target file." })
//             return
//         }

//         if (privateKey == null) {
//             res.status(401).json({ "error": "Missing pirvate key." })
//             return
//         }

//         const inputFilePath = uploadedFile.path;
//         const fileName = `decrypted_${uploadedFile.originalname}.replace(".enc", "")`;
//         const outputFilePath = `${uploadedFile.destination}${fileName}`;

//         // read data from the file
//         const readData = fs.readFileSync(inputFilePath, 'base64');

//         const readBufferData = Buffer.from(readData);

//         console.log(readBufferData)

//         console.log("readBufferDataLength: " + readBufferData.length);
//         console.log("readBufferData: " + readBufferData);

//         // as a buffer
//         let decryptedData = '';

//         const blockSize = 245;

//         for (let i = 0; i < readBufferData.length; i += blockSize) {
//             let chunk = readBufferData.slice(i, i + blockSize);

//             console.log(i, i + blockSize);

//             if (i + blockSize > readBufferData.length) {
//                 chunk = readBufferData.slice(i, readBufferData.length);
//             }

//             decryptedData = decryptedData.concat(crypto.privateDecrypt({
//                 key: privateKey,
//                 padding: crypto.constants.RSA_PKCS1_PADDING
//             }, chunk));

//         }

//         console.log("decryptedDataLength: " + decryptedData.length);
//         console.log("decryptedData: " + decryptedData);

//         const decryptedUTF8Data = decryptedData.toString('utf8');
//         console.log("decryptedUTF8DataLength: " + decryptedUTF8Data.length);
//         console.log("decryptedUTF8Data: " + decryptedUTF8Data);

//         fs.writeFile(outputFilePath, encryptedBase64Data, 'base64', (err) => {

//         });

//         res.status(200).json({ "message": "Decrypted successfully" })

//     } catch (err) {
//         console.log(err)
//         res.status(400).json({ "error": err.message })
//     }

// })


router.post('/public_key_encrypt', upload.single("uploaded_file"), (req, res) => {

    try {
        const uploadedFile = req.file
        const publicKey = req.body.publicKey;
        const maxDataSize = 3000;                   // byte 

        if (uploadedFile == null) {
            res.status(401).json({ "error": "Missing target file." })
            return
        }

        if (publicKey == null) {
            res.status(401).json({ "error": "Missing public key." })
            return
        }

        const inputFilePath = uploadedFile.path;
        const outputFilePath = `${uploadedFile.destination}encrypted${uploadedFile.originalname}`;

        if (uploadedFile.size > maxDataSize) {
            fs.unlinkSync(inputFilePath)
            res.status(401).json({ "error": "Target file size is too large." })
            return
        }

        // read data from the file
        const data = fs.readFileSync(inputFilePath, 'utf8');

        console.log("dataLength: " + data.length);
        console.log("data: " + data)

        const encryptedData = crypto.publicEncrypt({ key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, data).toString('base64');

        console.log("encryptedDataLength: " + encryptedData.length);
        console.log("encryptedData: " + encryptedData);

        // Writing base64 encrypted data to file
        fs.writeFileSync(outputFilePath, encryptedData, 'base64');

        // Delete the original unencrypted file
        fs.unlinkSync(inputFilePath)

        res.json({ 'message': 'File uploaded and encrypted successfully' });

    } catch (err) {
        console.log(err)
        res.status(400).json({ "error": err.message })
    }

})

router.post('/public_key_decrypt', upload.single("uploaded_file"), (req, res) => {

    try {
        const uploadedFile = req.file
        const privateKey = req.body.privateKey;

        if (uploadedFile == null) {
            res.status(401).json({ "error": "Missing target file." })
            return
        }

        if (privateKey == null) {
            res.status(401).json({ "error": "Missing private key." })
            return
        }

        const inputFilePath = uploadedFile.path;
        const fileName = `decrypted_${uploadedFile.originalname}`;

        // read data from the file
        const data = fs.readFileSync(inputFilePath, 'base64');

        // Decrpyt from the base64 data buffer
        const encryptedBuffer = Buffer.from(data, 'base64');

        const outputData = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, encryptedBuffer).toString('utf8');

        // Set the response headers to indicate a downloadable file
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'text/plain');

        // Send the decrypted content as the response
        res.status(200).json({
            "fileName": `${fileName}`,
            decryptedContent: outputData,
            'message': 'File decrypted with private key successfully'
        });

    } catch (err) {
        console.log(err)
        res.status(400).json({ "error": err.message })
    }

})


module.exports = router;