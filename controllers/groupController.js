const Group = require("../models/group");

exports.createGroup = async (req, res) => {
  const { name } = req.body;
  const { id } = req.user;

  try {
    const group = await Group.findOne({ name, createdBy: id });

    if (group) {
      return res.status(422).json({ message: "Group found with same name" });
    }

    // create new group
    const newGroup = new Group({ name, createdBy: id, users: [id] });
    const createdGroup = await newGroup.save();

    res.status(200).json({ group: createdGroup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateGroup = async (req, res) => {
  const { groupId } = req.params;
  const { name } = req.body;
  const { id } = req.user;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.name === name && group._id != groupId) {
      return res.status(422).json({ message: "Group found with same name" });
    }

    if (group.createdBy != id) {
      return res
        .status(403)
        .json({ message: "You are not allow for this operation." });
    }

    group.name = name;
    const updatedGroup = await group.save();

    res.status(200).json({ group: updatedGroup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params;
  const { id } = req.user;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.createdBy != id) {
      const updatedUsers = group.users.filter((item) => item != id);
      group.users = updatedUsers;
      await group.save();
      return res.status(200).json({ message: "Group deleted successfully" });
    }

    await Group.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchGroup = async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;
  const { id } = req.user;

  try {
    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Build the query object
    const query = { users: id };
    if (search) {
      query.name = { $regex: new RegExp(search, "i") }; // Case-insensitive search
    }

    // Find groups with pagination
    const groups = await Group.find(query)
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    // Get the total count of matching documents
    const totalGroups = await Group.countDocuments(query);

    // Send paginated response
    res.status(200).json({
      totalGroups,
      totalPages: Math.ceil(totalGroups / limitNumber),
      currentPage: pageNumber,
      groups,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  const { uniqueCode } = req.params;
  const { id } = req.user;

  try {
    const group = await Group.findOne({ uniqueCode });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isExist = group.users.includes(id);
    if (isExist) {
      return res.status(422).json({ message: "You are already in this group" });
    }

    group.users.push(id);
    const updatedGroup = await group.save();

    res.status(200).json({ group: updatedGroup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
