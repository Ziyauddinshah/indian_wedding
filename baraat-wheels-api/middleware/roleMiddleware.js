exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    if (!roles.includes(req.user.role_id)) {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not have access" });
    }

    next();
  };
};
