const express = require("express");
const router = express.Router();

const { viewSignIn, actionSignIn } = require("./handler/signin/controller");

router.get("/", viewSignIn);
router.post("/", actionSignIn);

module.exports = router;
