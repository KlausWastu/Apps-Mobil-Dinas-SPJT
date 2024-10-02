const express = require("express");
const router = express.Router();

const {
  index,
  viewDetail,
  actionCreate,
  viewEdit,
  actionEdit,
  actionDelete,
} = require("./handler/log/controller");
const { isLogin } = require("./middleware/auth");

router.use(isLogin);
router.get("/", index);
router.get("/details/:id", viewDetail);
// router.post("/create", actionCreate);
// router.get("/edit/:id", viewEdit);
// router.put("/edit/:id", actionEdit);
// router.delete("/delete/:id", actionDelete);

module.exports = router;
