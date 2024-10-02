const express = require("express");
const router = express.Router();

const { index, viewDetail, actionDelete } = require("./handler/log/controller");
const { isLogin, isAdmin } = require("./middleware/auth");

router.use(isLogin);
router.get("/", isAdmin, index);
router.get("/details/:id", isAdmin, viewDetail);

module.exports = router;
