const User = require('../models/User');
const { generateToken } = require('../utils/helpers');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email déjà utilisé" });
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir email et mot de passe' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    const token = generateToken(user);
    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: "Aucun utilisateur avec cet email" });

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `Réinitialisation du mot de passe : ${resetUrl}`;

    await sendEmail({ email: user.email, subject: 'Réinitialisation du mot de passe', message });

    res.status(200).json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error) {
    next(error);
  }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: resetPasswordToken,
      passwordResetExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ success: false, message: 'Token invalide ou expiré' });

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    next(error);
  }
};
