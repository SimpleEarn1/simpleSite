const user = await User.findById(req.user.id);

// 1. Увеличиваем investedAmount (или balance)
user.investedAmount += amount;
await user.save();

// 2. Если есть реферер — начисляем ему 20%
if (user.referrerId) {
  const referrer = await User.findById(user.referrerId);

  const bonus = amount * 0.2;
  referrer.balance += bonus;
  await referrer.save();

  // 3. Записываем в транзакции
  await new Transaction({
    userId: referrer._id,
    type: 'referralBonus',
    amount: bonus
  }).save();

  // 💾 также можно сохранить, сколько бонусов с этого реферала
  await ReferralBonus.updateOne(
    { inviterId: referrer._id, invitedId: user._id },
    { $inc: { earned: bonus } },
    { upsert: true }
  );
}