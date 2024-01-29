const express = require('express');
const axios = require('axios')
const sms = require('../sms');
const router = express.Router();

const conn = require('../config/database');

// 세부 상황 - t_facility 테이블 데이터 가져오기
router.post('/info', (req,res)=>{

    const {videoId} = req.body
    
    let sql = 'select * from t_facility where fac_num = ?';

    conn.query(sql, [videoId],(err, rows)=>{
        console.log('detail_info router')
        res.json({info_list : rows})
    })
})

// 세부 상황 - t_obj_record 테이블 데이터 가져오기
router.post('/record_list', (req, res)=>{
    
    const {videoId} = req.body;
    console.log('detail router');
    let sql = 'select * from t_obj_record where fac_num = ?';

    conn.query(sql, [videoId], (err, rows)=>{
        console.log('detail router2', rows);
        res.json({obj_list : rows})
    })
})

// sms
router.get('/sms', (req,res)=>{

    let sql = 'update t_facility set fac_situation = "경고" where fac_num = 1';
    conn.query(sql,(err, rows)=>{
        // console.log('db update', rows)
        let sql2 = 'select sms from t_facility where fac_num=1'
        conn.query(sql2, (err2,rows2)=>{
            // console.log('rows222',rows2[0].sms)
            if(rows2[0].sms === 0) {

                // sms 로직
                console.log('문자 보내기')
                // sms();
                
                let sql3 = 'update t_facility set sms = 1 where fac_num = 1';
                conn.query(sql3, (err3,rows3)=>{
                    console.log('rows3',rows3.length)
                })
            }

        })

    })
    res.json('bye')
})


module.exports = router;












