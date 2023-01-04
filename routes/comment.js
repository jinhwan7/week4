const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.send({'잘되요'});
});

module.exports = router;