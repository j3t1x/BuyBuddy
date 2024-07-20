const itemDao = require('../dao/itemDao');

class ItemController {
  async getAllItems(req, res) {
    try {
      const items = await itemDao.getAllItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching items' });
    }
  }

  async addItem(req, res) {
    try {
      const { name } = req.body;
      const newItem = await itemDao.addItem(name);
      res.json(newItem);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while adding the item' });
    }
  }

  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedItem = await itemDao.updateItem(id, name);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the item' });
    }
  }

  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      await itemDao.deleteItem(id);
      res.json({ message: 'Item deleted' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the item' });
    }
  }
}

module.exports = new ItemController();
