const prisma = require('../config/prisma');

// GET all folders for logged-in user
async function getFolders(req, res) {
  const folders = await prisma.folder.findMany({
    where: {
      userId: req.user.id
    },
    include: {
      files: true
    }
  });

  res.json(folders);
}

async function getFolder(req, res) {
  const { id } = req.params;

  const folder = await prisma.folder.findUnique({
    where: { id },
    include: {
      files: true
    }
  });

  res.json(folder);
}

// CREATE folder
async function createFolder(req, res) {
  const { name } = req.body;

  const folder = await prisma.folder.create({
    data: {
      name,
      userId: req.user.id
    }
  });

  res.json(folder);
}

// UPDATE folder
async function updateFolder(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  const folder = await prisma.folder.update({
    where: { id },
    data: { name }
  });

  res.json(folder);
}

// DELETE folder
async function deleteFolder(req, res) {
  const { id } = req.params;

  await prisma.folder.delete({
    where: { id }
  });

  res.json({ message: 'Folder deleted' });
}

module.exports = {
  getFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder
};