const express = require('express');
const router = express.Router();
const conn = require('../config/database');

// 전체목록
router.post('/list', (req, res) => {
  console.log('facilityList router');

  const sql = 'select * from t_facility';
  conn.query(sql, [], (err, rows) => {
    if (rows < 0) {
    } else {
      res.json(rows);
    }
  });
});

// 범위
router.post('/floorRange', (req, res) => {
  console.log('floorRange router');

  const sql = 'select company_floor from t_facility group by company_floor';
  conn.query(sql, [], (err, rows) => {
    if (rows < 0) {
    } else {
      res.json(rows.map(item => item.company_floor));
    }
  });
});

router.post('/floorList', (req, res) => {
  console.log('floorList router');
  const { facilityList, floorRange } = req.body;
  const floorObj = {};

  floorRange.map(floor => (
    floorObj[floor] = facilityList.filter(fac => fac.company_floor === floor)
  ));

  res.json(floorObj);
});

router.post('/test', (req, res) => {
  console.log('test');
  const { user_name } = req.body;

  const sql = 'select * from t_user where user_name = ?';
  conn.query(sql, [user_name], (err, rows) => {
    if (rows) {
      res.json(rows);
    }
  });

});

module.exports = router;