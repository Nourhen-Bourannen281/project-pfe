const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      req.user = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        name: user.name
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalide" });
    }
  } else {
    return res.status(401).json({ message: "Pas de token d'authentification" });
  }
};

module.exports = { protect };
