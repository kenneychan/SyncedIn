function authRole(role) {
  return (req, res, next) => {
    console.log("user", req.user, role, req.user[role]);
    if (!req.user[role]) {
      res.status(401);
      return res.send("Not allowed");
    }

    next();
  };
}

module.exports = {
  authRole,
};
