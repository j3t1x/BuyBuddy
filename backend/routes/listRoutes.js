const express = require('express');
const router = express.Router();
const List = require('../models/list');
const userMiddleware = require('../middleware/authMiddleware');

// Vytvořit nový seznam
router.post('/', userMiddleware, async (req, res) => {
  try {
    const newList = new List({ ...req.body, users: [req.user._id] });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Získat všechny seznamy pro přihlášeného uživatele
router.get('/', userMiddleware, async (req, res) => {
  try {
    const lists = await List.find({ users: req.user._id }).populate('items').populate('users');
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Získat jeden seznam podle ID pro přihlášeného uživatele
router.get('/:id', userMiddleware, async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.id, users: req.user._id }).populate('items').populate('users');
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Přidat uživatele do seznamu
router.put('/:id/addUser', userMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    if (!list.users.includes(userId)) {
      list.users.push(userId);
    }
    await list.save();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aktualizovat seznam
router.put('/:id', userMiddleware, async (req, res) => {
  try {
    const updatedList = await List.findOneAndUpdate({ _id: req.params.id, users: req.user._id }, req.body, { new: true });
    if (!updatedList) {
      return res.status(404).json({ message: 'List not found' });
    }
    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Smazat seznam
router.delete('/:id', userMiddleware, async (req, res) => {
  try {
    const deletedList = await List.findOneAndDelete({ _id: req.params.id, users: req.user._id });
    if (!deletedList) {
      return res.status(404).json({ message: 'List not found' });
    }
    res.status(200).json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
