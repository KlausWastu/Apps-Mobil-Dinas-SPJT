const express = require("express");
const router = express.Router();

const { index } = require("./handler/dashboard/controller");
const { isLogin, isAdmin } = require("./middleware/auth");

router.use(isLogin);
router.get("/", isAdmin, index);

module.exports = router;
