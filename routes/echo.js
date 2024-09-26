const express = require('express');
const router = express.Router();

router.get('/:content', function(req, res, next) {
    const content = req.params.content

    res.set('Content-Type', 'text/plain')
    res.set('Content-Length', content.length)
    res.status(200)
    res.send(content)

})

module.exports = router
