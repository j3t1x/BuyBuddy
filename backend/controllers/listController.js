const listDao = require('../dao/listDao');
const itemDao = require('../dao/itemDao');

class ListController {
  async createList(req, res) {
    try {
      const { name, userId } = req.body;
      const newList = await listDao.createList(name, userId);
      res.json(newList);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the list' });
    }
  }

  async addItemToList(req, res) {
    try {
      const { listId, itemName } = req.body;
      const newItem = await itemDao.addItem(itemName);
      const updatedList = await listDao.addItemToList(listId, newItem._id);
      res.json(updatedList);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while adding the item to the list' });
    }
  }

  async shareListWithUser(req, res) {
    try {
      const { listId, userId } = req.body;
      await listDao.shareListWithUser(listId, userId);
      res.json({ message: 'List shared with user' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while sharing the list' });
    }
  }

  async getList(req, res) {
    try {
      const { id } = req.params;
      const list = await listDao.findListById(id);
      res.json(list);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching the list' });
    }
  }

  async getUserLists(req, res) {
    try {
      const { userId } = req.params;
      const lists = await listDao.findListsByUserId(userId);
      res.json(lists);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching user lists' });
    }
  }
}

module.exports = new ListController();
