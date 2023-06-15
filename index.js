const express = require("express");
const MongoClient = require("mongodb").MongoClient;
//데이터베이스의 데이터 입력,출력을 위한 함수명령어 불러들이는 작업
const app = express();
const port = 7000;

//ejs 태그를 사용하기 위한 세팅
app.set("view engine","ejs");
//사용자가 입력한 데이터값을 주소로 통해서 전달되는 것을 변환(parsing)
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 
//css/img/js(정적인 파일)사용하려면 이코드를 작성!
app.use(express.static('public'));

//데이터 베이스 연결작업
let db; //데이터베이스 연결을 위한 변수세팅(변수의 이름은 자유롭게 지어도 됨)

MongoClient.connect("mongodb+srv://cisalive:cisaliveS2@cluster0.cjlsn98.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    //에러가 발생했을경우 메세지 출력(선택사항)
    if(err) { return console.log(err); }

    //위에서 만든 db변수에 최종연결 ()안에는 mongodb atlas 사이트에서 생성한 데이터베이스 이름
    db = result.db("Jameson");

    //db연결이 제대로 됬다면 서버실행
    app.listen(port,()=>{
        console.log("서버연결 성공");
    });

});

app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.get("/collections",(req,res)=>{
    res.render("collections.ejs");
});

app.get("/product/:link", (req, res)=>{
    db.collection("whiskey").findOne({link:req.params.link}, (err, result)=>{
        // req.params.link에 맞는 데이터를 가져오기
        res.render("detail.ejs", {data:result});
    })
})
