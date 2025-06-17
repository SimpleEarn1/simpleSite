const Transaction = require('../models/Transaction');
const User = require('../models/User').default;

exports.createTransaction = async (req, res) => {
  const { type, amount } = req.body;
  const userId = req.user._id;

  if (!['deposit', 'withdraw'].includes(type)) {
    return res.status(400).json({ message: 'Неверный тип операции' });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: 'Сумма должна быть положительной' });
  }

  try {
    const user = await User.findById(userId);

    if (type === 'withdraw' && user.balance < amount) {
      return res.status(400).json({ message: 'Недостаточно средств' });
    }

    const updatedBalance = type === 'deposit'
      ? user.balance + amount
      : user.balance - amount;

    user.balance = updatedBalance;
    await user.save();

    const transaction = new Transaction({ user: userId, type, amount });
    await transaction.save();

    res.status(201).json({ message: 'Операция выполнена', balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении истории' });
  }
};