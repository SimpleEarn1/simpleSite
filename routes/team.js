const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ReferralBonus = require('../models/ReferralBonus');
const { authMiddleware } = require('../middleware/auth'); // <-- исправлено

router.get('/', authMiddleware, async (req, res) => {  // <-- исправлено
  try {
    const userId = req.user.id;

    // 1. Найдём всех приглашённых
    const invited = await User.find({ referrerId: userId });

    // 2. Найдём сколько с каждого заработано
    const bonuses = await ReferralBonus.find({ referrerId: userId });

    const bonusMap = {};
    bonuses.forEach(b => {
      bonusMap[b.referredUserId.toString()] = b.earned;
    });

    // 3. Собираем ответ
    const team = invited.map(u => ({
      email: u.email,
      registeredAt: u.createdAt,
      earned: bonusMap[u._id.toString()] || 0
    }));

    res.json({ team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;