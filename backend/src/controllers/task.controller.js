const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedToId, projectId } = req.body;
    if (!title || !projectId) return res.status(400).json({ error: 'Title and projectId required' });
    const task = await prisma.task.create({
      data: { title, description, status: status || 'TODO', priority: priority || 'MEDIUM', dueDate: dueDate ? new Date(dueDate) : null, assignedToId: assignedToId ? parseInt(assignedToId) : null, projectId: parseInt(projectId), createdById: req.user.id },
      include: { assignedTo: { select: { id: true, name: true } }, createdBy: { select: { id: true, name: true } } }
    });
    res.status(201).json(task);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const { projectId, status, assignedToId } = req.query;
    const where = {};
    if (projectId) where.projectId = parseInt(projectId);
    if (status) where.status = status;
    if (assignedToId) where.assignedToId = parseInt(assignedToId);
    const tasks = await prisma.task.findMany({ where, include: { assignedTo: { select: { id: true, name: true } }, createdBy: { select: { id: true, name: true } }, project: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } });
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: parseInt(req.params.id) }, include: { assignedTo: true, createdBy: true, project: true } });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedToId } = req.body;
    const task = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data: { title, description, status, priority, dueDate: dueDate ? new Date(dueDate) : undefined, assignedToId: assignedToId ? parseInt(assignedToId) : null },
      include: { assignedTo: { select: { id: true, name: true } } }
    });
    res.json(task);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Task deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const [totalTasks, myTasks, overdue, todo, inProgress, done] = await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { assignedToId: userId } }),
      prisma.task.count({ where: { dueDate: { lt: now }, status: { not: 'DONE' } } }),
      prisma.task.count({ where: { status: 'TODO' } }),
      prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { status: 'DONE' } }),
    ]);
    const recentTasks = await prisma.task.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { project: { select: { name: true } }, assignedTo: { select: { name: true } } } });
    res.json({ totalTasks, myTasks, overdue, todo, inProgress, done, recentTasks });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
