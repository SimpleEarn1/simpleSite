const express = require('express');
const router = express.Router();

// Пример маршрута
router.get('/', (req, res) => {
  res.send('Transactions route работает!');
});

module.exports = router;