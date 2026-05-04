const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Project name required' });
    const project = await prisma.project.create({ data: { name, description } });
    await prisma.projectMember.create({ data: { userId: req.user.id, projectId: project.id, role: 'ADMIN' } });
    res.status(201).json(project);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'ADMIN') {
      projects = await prisma.project.findMany({ include: { members: { include: { user: { select: { id: true, name: true, email: true } } } }, _count: { select: { tasks: true } } } });
    } else {
      const memberships = await prisma.projectMember.findMany({ where: { userId: req.user.id }, select: { projectId: true } });
      const ids = memberships.map(m => m.projectId);
      projects = await prisma.project.findMany({ where: { id: { in: ids } }, include: { members: { include: { user: { select: { id: true, name: true, email: true } } } }, _count: { select: { tasks: true } } } });
    }
    res.json(projects);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { members: { include: { user: { select: { id: true, name: true, email: true, role: true } } } }, tasks: { include: { assignedTo: { select: { id: true, name: true } }, createdBy: { select: { id: true, name: true } } } } }
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await prisma.project.update({ where: { id: parseInt(req.params.id) }, data: { name, description } });
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await prisma.task.deleteMany({ where: { projectId: parseInt(req.params.id) } });
    await prisma.projectMember.deleteMany({ where: { projectId: parseInt(req.params.id) } });
    await prisma.project.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Project deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const member = await prisma.projectMember.create({ data: { userId: parseInt(userId), projectId: parseInt(req.params.id), role: role || 'MEMBER' } });
    res.status(201).json(member);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    await prisma.projectMember.deleteMany({ where: { projectId: parseInt(req.params.id), userId: parseInt(req.params.userId) } });
    res.json({ message: 'Member removed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
