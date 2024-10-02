const express = require("express");
const router = express.Router();

const {
  index,
  viewCreate,
  actionCreate,
  viewEdit,
  actionEdit,
  actionDelete,
  viewDetail,
} = require("./handler/car-usage/controller");
const { isLogin } = require("./middleware/auth");

router.use(isLogin);
router.get("/", index);
router.get("/create", viewCreate);
router.post("/create", actionCreate);
router.get("/edit/:id", viewEdit);
router.put("/edit/:id", actionEdit);
router.get("/detail/:id", viewDetail);
router.delete("/delete/:id", actionDelete);

module.exports = router;
