const { restoreFromS3 } = require("../services/restoreService");

const restoreBackup = async (req, res) => {
  try {
    if (req.query.secret !== process.env.CRON_SECRET) {
      return res.status(401).send("Unauthorized");
    }

    const { fileKey, dbUri } = req.body;

    await restoreFromS3(fileKey, dbUri);

    res.json({ success: true, message: "Restore completed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { restoreBackup };
