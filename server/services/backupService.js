const { Upload } = require("@aws-sdk/lib-storage"); // Changed to use Upload
const s3Client = require("../utils/s3Client");
const mongoose = require("mongoose");
const { EJSON } = require("bson");
const zlib = require("zlib");
const { Readable } = require("stream");

const performBackup = async () => {
  const date = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Jerusalem",
  });
  const fileName = `backup-${date}.json.gz`;

  console.log(`[Backup] Starting backup with Gzip compression`);

  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const backupData = {};

    for (const col of collections) {
      const name = col.name;
      backupData[name] = await db.collection(name).find({}).toArray();
    }

    const jsonString = EJSON.stringify(backupData, { relaxed: false });

    // Create the stream pipeline
    const inputStream = Readable.from(jsonString);
    const gzip = zlib.createGzip();
    const compressedStream = inputStream.pipe(gzip);

    // Using @aws-sdk/lib-storage to handle the stream upload safely
    const parallelUpload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `backups/${fileName}`,
        Body: compressedStream,
        ContentType: "application/gzip",
      },
    });

    // Wait for the upload to complete
    await parallelUpload.done();

    console.log("[Backup] Compressed and uploaded to S3 successfully");
  } catch (err) {
    console.error("[Backup] Backup failed:", err);
    throw err;
  }
};

module.exports = { performBackup };
