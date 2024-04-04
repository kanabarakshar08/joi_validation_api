const express = require('express');
const router = express.Router();
const admincontroller = require('../controller/admincontroller');
const admin  = require('../model/admin');
router.post("/admin_register",admin.uploadImage,admincontroller.admin_register);
router.get("/view_profile",admincontroller.view_profile);
router.put("/edit_admin/:id",admin.uploadImage,admincontroller.edit_admin)
router.delete("/delte_admin/:id",admincontroller.delte_admin);
router.post("/multepleselce",admincontroller.multepleselce)

module.exports = router;