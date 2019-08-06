var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/getuser', function(req, res, next) {
    //res.render('index', { title: 'Avnish' });
    res.status(200).json({
        'name': 'avnish kumar',
        'email': 'abc@h.com',
        'friends': [{ 'name': 'bishal', 'sec': 'B' }, { 'name': 'DDM', 'sec': 'B' }]
    })
});
router.post('/saveuser', (req, res, next) => {
    //res.render('index', { title: 'Avnish' });
    console.log(req.body);
    res.status(200).json({
        'status': true,
        'msg': 'user saved'
    })
});
router.get('/', (req, res) => {
    console.log(req.Route);
    console.log(req.Url);
    res.render('index', { title: 'abc' });
})

module.exports = router;