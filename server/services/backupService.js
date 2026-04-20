const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../utils/s3Client");

const BACKUP_DIR = path.join(__dirname, "../../backups");

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

const performBackup = async () => {
  const date = new Date().toISOString().split("T")[0];
  const fileName = `backup-${date}.gz`;
  const filePath = path.join(BACKUP_DIR, fileName);

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing");
  }

  console.log(`[Backup] Starting ${date}`);

  return new Promise((resolve, reject) => {
    const dump = spawn("mongodump", [
      `--uri=${mongoUri}`,
      `--archive=${filePath}`,
      "--gzip",
    ]);

    dump.stderr.on("data", (data) => {
      console.error(`[mongodump error]: ${data}`);
    });

    dump.on("error", (err) => {
      reject(err);
    });

    dump.on("close", async (code) => {
      if (code !== 0) {
        return reject(new Error("mongodump failed with code " + code));
      }

      try {
        const fileStream = fs.createReadStream(filePath);

        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `backups/${fileName}`,
            Body: fileStream,
          }),
        );

        fs.unlinkSync(filePath);

        console.log("[Backup] Uploaded to S3 successfully");
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
};

module.exports = { performBackup };
