const Item = require('../models/item');

class ItemDao {
  async getAllItems() {
    return await Item.find();
  }

  async getItemById(id) {
    return await Item.findById(id);
  }

  async addItem(name) {
    const newItem = new Item({ name });
    return await newItem.save();
  }

  async updateItem(id, name) {
    return await Item.findByIdAndUpdate(id, { name }, { new: true });
  }

  async deleteItem(id) {
    return await Item.findByIdAndDelete(id);
  }
}

module.exports = new ItemDao();
