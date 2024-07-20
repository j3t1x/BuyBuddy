const List = require('../models/list');
const User = require('../models/user');

class ListDao {
  async createList(name, userId) {
    const newList = new List({ name, users: [userId] });
    const savedList = await newList.save();
    await User.findByIdAndUpdate(userId, { $push: { lists: savedList._id } });
    return savedList;
  }

  async addItemToList(listId, itemId) {
    return await List.findByIdAndUpdate(listId, { $push: { items: itemId } }, { new: true });
  }

  async shareListWithUser(listId, userId) {
    await List.findByIdAndUpdate(listId, { $push: { users: userId } });
    return await User.findByIdAndUpdate(userId, { $push: { lists: listId } });
  }

  async findListById(id) {
    return await List.findById(id).populate('items').populate('users');
  }

  async findListsByUserId(userId) {
    return await List.find({ users: userId }).populate('items');
  }
}

module.exports = new ListDao();
