const mongoose = require("mongoose");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../utils/s3Client");

const restoreFromS3 = async (fileKey, targetDbUri) => {
  console.log("[Restore] connecting to temp DB...");

  const connection = await mongoose.createConnection(targetDbUri).asPromise();

  const db = connection.db;

  const data = await s3Client.send(
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
    }),
  );

  const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (c) => chunks.push(c));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });

  const json = await streamToString(data.Body);
  const backup = JSON.parse(json);

  for (const [collectionName, docs] of Object.entries(backup)) {
    const collection = db.collection(collectionName);

    await collection.deleteMany({});
    if (docs.length) await collection.insertMany(docs);

    console.log(`[Restore] ${collectionName} done`);
  }

  await connection.close();

  console.log("[Restore] Completed");
};

module.exports = { restoreFromS3 };
