const { performBackup } = require("../services/backupService");

const runBackup = async (req, res) => {
  if (req.query.secret !== process.env.CRON_SECRET) {
    return res.status(401).send("Unauthorized");
  }

  try {
    await performBackup();
    res.json({ success: true, message: "Backup completed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { runBackup };
