var express = require("express");
var router = express.Router();

let userInfo={
    userID:0,
    username:"测试账号",
    wealth:1000,
    lev:4,
    exp:1069,
    fans:0,
    post:0,
    restTime:365,
}


router.post('/', (req, res) => {
    if (req.body.name == "admin") {
        res.status(200).json({
            ...userInfo
          });
    } else {
        res.send('用户名错误')
    }
})

module.exports = router;
