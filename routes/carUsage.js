const express = require("express");
const router = express.Router();
const multer = require("multer");
const os = require("os");

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
const upload = multer({ dest: os.tmpdir() });

router.use(isLogin);
router.get("/", index);
router.get("/create", viewCreate);
router.post("/create", upload.array("files", 3), actionCreate);
router.get("/edit/:id", viewEdit);
router.put("/edit/:id", upload.array("files", 3), actionEdit);
router.get("/detail/:id", viewDetail);
router.delete("/delete/:id", actionDelete);

module.exports = router;
