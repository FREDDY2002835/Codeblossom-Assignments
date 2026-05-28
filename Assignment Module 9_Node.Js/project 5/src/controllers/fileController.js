const prisma = require('../config/prisma');

// UPLOAD FILE
async function uploadFile(req, res) {
  const { folderId } = req.body;

  const file = await prisma.file.create({
    data: {
      name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      cloudUrl: req.file.path, // Cloudinary URL
      folderId,
      userId: req.user.id
    }
  });

  res.json(file);
}

// GET FILE DETAILS
async function getFile(req, res) {
  const { id } = req.params;

  const file = await prisma.file.findUnique({
    where: { id }
  });

  res.json(file);
}

// DOWNLOAD FILE
const path = require('path');

async function downloadFile(req, res) {
  const { id } = req.params;

  const file = await prisma.file.findUnique({
    where: { id }
  });

  if (!file) return res.status(404).send('File not found');

  res.redirect(file.cloudUrl);
}

module.exports = {
  uploadFile,
  getFile,
  downloadFile
};