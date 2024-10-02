const express = require("express");
const router = express.Router();

const {
  index,
  viewCreate,
  actionCreate,
  viewEdit,
  actionEdit,
  actionDelete,
} = require("./handler/organization/controller");
const { isLogin, isAdmin } = require("./middleware/auth");

router.use(isLogin);
router.get("/", isAdmin, index);
router.get("/create", isAdmin, viewCreate);
router.post("/create", isAdmin, actionCreate);
router.get("/edit/:id", isAdmin, viewEdit);
router.put("/edit/:id", isAdmin, actionEdit);
router.delete("/delete/:id", isAdmin, actionDelete);

module.exports = router;
