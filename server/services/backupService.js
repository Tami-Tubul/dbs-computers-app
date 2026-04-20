const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../utils/s3Client");
const mongoose = require("mongoose");

const performBackup = async () => {
  const date = new Date().toISOString().split("T")[0];
  const fileName = `backup-${date}.json`;

  console.log(`[Backup] Starting ${date}`);

  try {
    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();

    const backupData = {};

    for (const col of collections) {
      const name = col.name;
      const data = await db.collection(name).find({}).toArray();
      backupData[name] = data;
    }

    const jsonData = JSON.stringify(backupData);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `backups/${fileName}`,
        Body: jsonData,
        ContentType: "application/json",
      }),
    );

    console.log("[Backup] Uploaded to S3 successfully");
  } catch (err) {
    console.error("[Backup] failed:", err);
    throw err;
  }
};

module.exports = { performBackup };
