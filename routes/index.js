var express = require('express');
var router = express.Router();

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.originalname.toString().indexOf('.jpg') > 0){
      cb(null, 'uploads/');
    }
    else {
      //tu choi luu file + hien loi
      cb(new Error('JPG Only!!!'))
    }
  },
  filename: function(req, file, cb) {
     cb(null, Math.random() + Date.now() + file.originalname + '-');
  },
});


var upload = multer({ storage: storage,
  limit : {fileSize : 1*1024*1024} });

var db = 'mongodb+srv://tahuuduc:zxcvbnm1@cluster0.ytnhj.mongodb.net/tinder?retryWrites=true&w=majority'
const mongoose = require('mongoose');

const {Schema} = mongoose;
mongoose.connect(db).catch(error => {
  if (error){
    console.log("co loi"+error.message)
  }
});

const Student = new Schema({
  email : String,
  firstName : String,
  lastName : String,
  password : String
})

const SV = mongoose.model('Student',Student)


/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log("Vao trang chu");

  //lay danh sasch
  var sinhViens = await SV.find({});

  res.render('index', { data : sinhViens });
});

router.get('/cars', function(req, res, next) {
  console.log("Vao trang o to");
  var data = "Kiem tra"


  var mang = [0,1,3,4,5,6,7]

  var sinhVien = {name : "Duc",age : 33}
  res.render('car', { title: 'Cars' ,duLieu: data,mang : mang,sinhVien : sinhVien});
});

router.post('/insertUser',function (req,res) {

  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var password = req.body.password;

  console.log(email + " - " + firstName + " - "+ lastName +" - "+ password);
  var data1 = email + " - " + firstName + " - "+ lastName +" - "+ password;

  res.render('index',{duLieu : data1});
  console.log("insertUser");


  //viet cau lenh them
  //b1 : dinh nghia khung cua model - sinh vien(id,name,email) - tu dinh nghia khung eing(Schema)
  //b2: mo ket noi den collection - bang
  //b3 : goi cau lenh insert voi dlieu cua minh


  const sinhVienMoi = new SV({
    email : email,
    firstName : firstName,
    lastName : lastName,
    password : password
  })

  sinhVienMoi.save(function (error) {
    if (error){
      res.render('index',{message : " Them 0 thanh cong" + error.message})
    }else {
      res.render('index',{message : " Them thanh cong"})
    }
  })
});


router.get('/covid',function (req,res) {

  res.render('covid');



});

router.post('/news',function (req,res) {
  var hoTen = req.body.hoTen;
  var queQuan = req.body.queQuan;
  var sdt = req.body.sdt;

  var khai = hoTen + "-" +queQuan+"-"+sdt;

  console.log(hoTen + " - " + queQuan +" - "+ sdt);
  res.render('news',{ok : khai});

});

router.get('/xoa',async function (req,res) {

  await SV.deleteOne({_id : req.query.id});
  //xoa xong thi quay ve trang chu
  res.redirect('/');



});

router.get('/sua', async function (req,res) {

  var id = req.query.id;

  res.render('sua',{id : id});

});


router.post('/updateSinhVien',async function (req,res) {

  var id = req.body.id;

  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var password = req.body.password;

  var sinhVienMoi1 = {
    email : email,
    firstName : firstName,
    lastName : lastName,
    password : password
  }

  await SV.findOneAndUpdate({_id: id},sinhVienMoi1,function (error) {
    res.redirect('/')
  })
});

router.get('/chitiet',async function (req,res) {

  var sinhVien = await SV.find({_id : req.query.id});
  //xoa xong thi quay ve trang chu
  res.render('chitiet',{data : (sinhVien[0])});

});

var uploadSingle= upload.single('avatar')
router.post('/single',upload.single('avatar'),function (req,res) {
  
  uploadSingle(req,res,function (error) {
    if (error){
      console.log('Co loi xay ra' + error.message)
      res.render('index',{message : error.message})

    }else {
      res.redirect('/')
    }
  })
  
})

router.post('/multi',upload.array('avatar',2),function (req,res) {
  res.redirect('/')
})


router.post('/singleapi',upload.single('avatar'),function (req,res) {

  uploadSingle(req,res,function (error) {
    if (error){
      console.log('Co loi xay ra' + error.message)
      res.send({
        code : 200,
        message : error.message
      })

    }else {
      res.send({
        code : 200,
        message : error.message
      })
    }
  })

})

module.exports = router;
