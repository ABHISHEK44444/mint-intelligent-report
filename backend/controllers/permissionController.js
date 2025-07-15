import Permission from '../models/permissionModel.js';

// @desc    Get all permissions
// @route   GET /api/permissions
// @access  Private/Admin
export const getPermissions = async (req, res) => {
    const permissions = await Permission.find({})
        .populate('viewerId', 'id name')
        .populate('targetId', 'id name');
    res.json(permissions);
};

// @desc    Add a permission
// @route   POST /api/permissions
// @access  Private/Admin
export const addPermission = async (req, res) => {
    const { viewerId, targetId } = req.body;

    if (viewerId === targetId) {
        return res.status(400).json({ message: "User cannot have permission to view their own reports" });
    }

    const permissionExists = await Permission.findOne({ viewerId, targetId });

    if (permissionExists) {
        return res.status(400).json({ message: 'Permission already exists' });
    }

    const permission = await Permission.create({ viewerId, targetId });
    res.status(201).json(permission);
};

// @desc    Remove a permission
// @route   DELETE /api/permissions/:id
// @access  Private/Admin
export const removePermission = async (req, res) => {
    const permission = await Permission.findById(req.params.id);

    if (permission) {
        await permission.deleteOne();
        res.json({ message: 'Permission removed' });
    } else {
        res.status(404).json({ message: 'Permission not found' });
    }
};
