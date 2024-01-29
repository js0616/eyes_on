const express = require('express');
const router = express.Router();
const conn = require('../config/database')
const crypto = require('crypto');

// login
router.post('/login', (req, res) => {
  console.log(`router - login`);
  const { userId, userPw } = req.body;
  console.log(userId, userPw);

  let sql = 'SELECT user_pw, user_salt FROM t_user WHERE user_id = ?';
  conn.query(sql, [userId], (err, rows) => {
    if (err) {
      res.status(500).send('서버 오류 발생');
      return;}
    if (rows.length > 0) {
      const user = rows[0];
      const hash = crypto.pbkdf2Sync(userPw, user.user_salt, 1000, 64, `sha512`).toString(`hex`);
      if (user.user_pw === hash) {
        res.json({ success: true, message: '로그인 성공' });
      } else {
        res.json({ success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' });}
    } else {
      res.json({ success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' });}
  });
});

// join
router.post('/join', (req, res) => {
  console.log(`router - join`);

  const { userId, userName, userPw, userPhone, userPart } = req.body;

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(userPw, salt, 1000, 64, `sha512`).toString(`hex`);

  let sql = 'INSERT INTO t_user (user_id, user_name, user_pw, user_salt, user_tel, company_name, user_yn) VALUES (?, ?, ?, ?, ?, ?, ?)';
  conn.query(sql, [userId, userName, hash, salt, userPhone, userPart, 0], (err, result) => {
    if (err) {
      res.status(500).send('서버 오류 발생');
      return;
    }
    res.json({ success: true, message: '회원가입 성공' });
  });
});

// id 중복 check
router.post('/idcheck', (req, res) => {

  const { userId } = req.body;

  let sql = 'select count(*) as count from t_user where user_id = ?'
  conn.query(sql, [userId], (err, rows) => {
    if (err) {
      res.status(500).send('서버 오류 발생')
    } else {
      if (rows[0].count > 0){
        res.json({ isAvailable: false})
      } else {
        res.json({ isAvailable: true})                        

      }
    }
  })
});





module.exports = router;