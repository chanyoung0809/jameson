const express = require("express"); // 익스프레스
const multer  = require('multer');  // 파일업로드용 멀터
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

// 로그인 검정 및 세션 생성에 필요한 기능 사용
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret :'secret', resave : false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session()); 

// 로그인시 검증 처리
passport.use(new LocalStrategy({
    usernameField:"memberid",
    passwordField:"memberpass",
    session:true,
    },      //해당 name값은 아래 매개변수에 저장
    function(memberid, memberpass, done) {
                    //회원정보 콜렉션에 저장된 아이디랑 입력한 아이디랑 같은지 체크                                 
      db.collection("members").findOne({ memberid:memberid }, function (err, user) {
        if (err) { return done(err); } //아이디 체크 시 코드(작업 X)
        if (!user) { return done(null, false); }  //아이디 체크 시 코드(작업 X)
        //비밀번호 체크 여기서 user는 db에 저장된 아이디의 비번값
        if (memberpass == user.memberpass) { // 비밀번호 체크 시 코드
            // 저장된 비밀번호가, 유저가 입력한 비밀번호와 같으면 if
            return done(null, user);
          } else {
            // 다르면 else
            return done(null, false);
          }
      });
    }
));
//처음 로그인 했을 시 세션 생성 memberid는 데이터에 베이스에 로그인된 아이디
//세션 만들어줌
passport.serializeUser(function (user, done) {
    done(null, user.memberid)
});
  
//다른 페이지(서브페이지,게시판 페이지 등 로그인 상태를 계속 표기하기 위한 작업)
//로그인이 되있는 상태인지 체크
passport.deserializeUser(function (memberid, done) {
// memberid<- 찾고자 하는 id : memberid<- 로그인했을 때 id
    db.collection('members').findOne({memberid:memberid }, function (err,result) {
        done(null, result);
    });
}); 

//데이터 베이스 연결작업
let db; //데이터베이스 연결을 위한 변수세팅(변수의 이름은 자유롭게 지어도 됨)

MongoClient.connect("mongodb+srv://cisalive:cisaliveS2@cluster0.cjlsn98.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    //에러가 발생했을경우 메세지 출력(선택사항)
    if(err) { return console.log(err); }

    //위에서 만든 db변수에 최종연결 ()안에는 mongodb atlas 사이트에서 생성한 데이터베이스 이름
    db = result.db("Jameson");

    //db연결이 제대로 됬다면 서버실행
    app.listen(port,()=>{
        console.log(`서버연결 성공, http://localhost:${port} 로 접속하세요`);
    });

});

// 파일 저장을 위한 multer 설정 구간
const storage = multer.diskStorage({
    // storage 상수
    destination: function (req, file, cb) {
        // 어디에 저장할 것인가?
      cb(null, 'public/upload') //업로드 폴더 지정
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8'))
      // 영어가 아닌 다른 파일명 안깨지고 나오게 처리(궰쇊어 안나오게 해줌)
    }
  })
  
const upload = multer({ storage: storage })
//upload는 위의 설정사항을 담은 변수(상수) 

app.get("/login", (req, res)=>{
    //로그인 페이지
    res.render("login", {login:req.user});
});
app.post("/logincheck", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error(err);
        return res.status(500).send("서버 오류");
      }
      if (!user) {
        return res.status(401).send("<script>alert('아이디 또는 패스워드가 맞지 않습니다.'); window.location.href='/login';</script>");
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("서버 오류");
        }
        return res.redirect("/");
      });
    })(req, res, next);
  });
  
app.get("/logout",(req,res)=>{
    // 로그아웃 함수 적용 후 메인페이지로 이동
    // 로그아웃 함수는 서버의 세션을 제거해주는 역할
    req.logout(()=>{
        res.redirect("/")
    })  
})

// 회원가입 페이지
app.get("/join", (req,res)=>{
    res.render("join", {login:req.user});
});
//회원가입 DB 처리
app.post("/joindb",(req,res)=>{
    db.collection("members").findOne({userMail:req.body.memberid},(err,member)=>{
        if(member){ 
            // 중복 아이디 있는 경우
            res.send(`<script> alert("이미 가입된 아이디가 존재합니다."); location.href="/login"; </script>`)
            // 로그인 페이지로 이동
        }
        else{
            db.collection("count").findOne({name:"회원수"},(err,result)=>{
                db.collection("members").insertOne({
                    No:result.memberCount, // 회원번호
                    memberName:req.body.memberName, // 회원이름
                    memberid:req.body.memberid, // 아이디
                    memberpass:req.body.memberpass, // 비밀번호
                    memberemail:`${req.body.memberemail}@${req.body.email_domain}`, // 이메일
                    memberphone:`${req.body.memberphone1}-${req.body.memberphone2}-${req.body.memberphone3}`, // 핸드폰 번호
                    role:"common" // 역할 - 일반회원
                },(err)=>{
                    db.collection("count").updateOne({name:"회원수"},{$inc:{memberCount:1}},(err)=>{
                        res.send(`<script> alert("회원가입이 완료되었습니다."); location.href="/login";  </script>`);
                    });
                })
            })
        }
    })
})

// 성인인증 페이지(추후 첫 세션 접속시에만 등장하게 함)
app.get("/validAdult",(req,res)=>{
    res.render("validAdult");
});

// 메인 페이지
app.get("/",(req,res)=>{
    db.collection("whiskey").find().toArray((err, whiskey)=>{
        db.collection("recipe").find().toArray((err, recipe)=>{
            let recipes = [];
            for(let i=0; i<recipe.length; i+=3){
                recipes.push(recipe[i]);
            }
            res.render("index", {whiskey:whiskey, recipes:recipes, login:req.user})
        });
    });
    
});

// 위스키 전체목록 페이지
app.get("/collections",(req,res)=>{
    res.render("collections.ejs",{login:req.user});
});
// 위스키 상세 페이지
app.get("/product/:link", (req, res)=>{
    db.collection("whiskey").findOne({link:req.params.link}, (err, prdResult)=>{
        db.collection("recipe").find({whiskey : req.params.link}).toArray((err, result)=>{
            res.render("detail.ejs", {data:prdResult, cocktails:result, login:req.user});
        })
    })
})

// 레시피 전체 목록
app.get("/recipes",(req,res)=>{
    db.collection("recipe").find().toArray((err, recipes)=>{
        db.collection("whiskey").find().toArray((err, whiskey)=>{
            res.render("recipes",{recipes:recipes, whiskey:whiskey, login:req.user});
        })  
    })
});
// 레시피 전체 목록을 위스키별로 분류했을 때 페이지
app.get("/recipes/:link",(req,res)=>{
    db.collection("whiskey").find().toArray((err, whiskey)=>{
        db.collection("recipe").find({"whiskey":req.params.link}).toArray((err, recipes)=>{
            res.render("recipes",{recipes:recipes, whiskey:whiskey, login:req.user});
        })
    })    
});
// 레시피 상세페이지
app.get("/recipe/:link",(req,res)=>{
    db.collection("recipe").findOne({"link":req.params.link}, (err, recipe)=>{
        db.collection("recipe").find().toArray((err, allRecipes)=>{
            res.render("recipeDetail",{recipe:recipe, allRecipes:allRecipes, login:req.user});
        });

    })
});

// 판매처 페이지
app.get("/location",(req,res)=>{
    db.collection("cities").find().toArray((err, cities)=>{    
        let citiesSort = cities.slice(); //배열 복제본. clone은 얕은 복제라서 원본이 수정됨 
        citiesSort = citiesSort.sort((a, b)=>{
            // 오름차순 정렬한 새로운 배열 생성
            if(a.korName > b.korName) return 1;
            if(a.korName < b.korName) return -1;
            return 0;
        });
        db.collection("store").find().toArray((err, stores)=>{    
            res.render("location.ejs", {cities:cities, citiesSort:citiesSort, stores: stores, login:req.user, test:"noselect", text:""});
        })
    });
});

/* 판매처 찾기 기능 - 지역명 / 매장,도로명,지번주소로 찾기 2개 */
//지역명검색 db요청
app.get("/storelocation",(req,res)=>{
    db.collection("cities").find().toArray((err, cities)=>{    
        let citiesSort = cities.slice(); //배열 복제본
        citiesSort = citiesSort.sort((a, b)=>{
            // 오름차순 정렬한 새로운 배열 생성
            if(a.korName > b.korName) return 1;
            if(a.korName < b.korName) return -1;
            return 0;
        });
    //지역명으로 검색해서 데이터가 전달된 경우
        if(req.query.storeLegion !== "noselect"){
            db.collection("store").find({engName:req.query.storeLegion}).toArray((err,stores)=>{
                res.render("location.ejs",{
                    cities:cities, 
                    citiesSort:citiesSort,
                    stores: stores,
                    test:req.query.storeLegion,
                    login:req.user,
                    text:req.query.searchWord, // 검색값
                })
            })
        }
        //지역명 선택안한경우 -> 매장 목록 페이지 경로로 요청
        else {
            res.redirect("/location");
        }
    });
})

// 매장명 검색 DB요청
app.get("/storename",(req,res)=>{
    let check = [
        {
            // $search:{ 뭘 어떻게 찾을 건지?
            $search:{
                
                index: "locationSearch", //db사이트에서 설정한 index 이름
                text:{
                    query: req.query.searchWord,
                    // 검색단어 입력단어값 (query:명령을 내리다, 질의하다)
                    path: req.query.search,
                    // 어떤 항목을 검색할 것인지?
                    // 여러 개 설정할 때는 배열로 설정
                }   
            }
        },
        {
            // 어떻게 정렬할 것인가? 1-> 오름차순, -1 -> 내림차순
            $sort:{num:-1}
        },
    ]
    
    db.collection("cities").find().toArray((err, cities)=>{    
        let citiesSort = cities.slice(); //배열 복제본
        // citiesSort는 오름차순 정렬한 새료운 배열
        citiesSort = citiesSort.sort((a, b)=>{
            // 오름차순 정렬한 새로운 배열 생성
            if(a.korName > b.korName) return 1;
            if(a.korName < b.korName) return -1;
            return 0;
        });
        //위에서 설정한 변수 check를 aggregate 매개변수로 가져옴
        db.collection("store").aggregate(check).toArray((err,stores)=>{
            // stores 배열 형태로 가져옴. 없을 땐 빈 배열이 출력됨
            if(stores.length > 0){
                res.render("location.ejs",{
                    cities:cities, 
                    citiesSort:citiesSort,
                    stores: stores,
                    test:stores[0].engName,
                    login:req.user,
                    text:req.query.searchWord, // 검색값
                })
            }
            else {
                res.render("location.ejs",{
                    cities:cities, 
                    citiesSort:citiesSort,
                    stores: undefined,
                    test: "noselect",
                    login:req.user,
                    text:req.query.searchWord, // 검색값
                })
            }
        })
    });
})

// 히스토리 페이지
app.get("/history",(req,res)=>{
    db.collection("history").find().toArray((err, history)=>{
        res.render("history", {history:history, login:req.user});
    })
});
// 양조장 페이지
app.get("/craft",(req,res)=>{
    db.collection("craft").find().toArray((err, craft)=>{
        res.render("craft", {craft:craft, login:req.user});
    })
});
// 이용약관 페이지
app.get("/terms",(req,res)=>{
    res.render("terms", {login:req.user});
});

// 자주묻는 질문 페이지
app.get("/faq",(req,res)=>{
    res.render("faq", {login:req.user});
});

// 회원전용 Qna 페이지 - Qna 모두보기
// (일반 회원 -  자기가 쓴 글만 보임, 어드민 - 모든 글이 보임)
// 답변 여부도 변수에 저장해야 함.
app.get("/qna", (req, res) => {
    if (req.user) {
        if (req.user.role === "ADMIN") {
        db.collection("QnAs").find().sort({ Q_num: -1 }).toArray((err, result) => {
            // 어드민 계정은 모든 글을 보여줌
            res.render("QnA", {login: req.user, data: result});
          });
        } 
        else {
        db.collection("QnAs").find({ Q_author: req.user.memberName }).sort({ Q_num: -1 }).toArray((err, result) => {
            // 자신이 작성한 글만 보여줌
            res.render("QnA", {login: req.user, data: result});
          });
        }
    } 
    else {
        res.send("<script>alert('비회원은 QnA 서비스를 이용하실 수 없습니다.'); window.location.href='/login';</script>");
    }
  });
  

// Qna 상세 글 페이지 - 공지사항
app.get("/qna/detail/notice",(req,res)=>{
    if(req.user){
        res.render("QnaNotice", {login:req.user});
    }
    else {
        res.send("<script>alert('비회원은 QnA 서비스를 이용하실 수 없습니다.'); window.location.href='/login';</script>")
    }
    
});

// Qna 상세 글 페이지 - 상세 글
app.get("/qna/detail/:idx",(req,res)=>{
    if(req.user){
        db.collection("QnAs").findOne({Q_num:Number(req.params.idx)},(err,result)=>{
            // find로 찾아온 데이터값은 result에 담긴다
            // 상세페이지 보여주기위해서 찾은 데이터값을 함께 전달한다.
            res.render("QnaDetail", {login:req.user, data:result});
        });
    }
    else {
        res.send("<script>alert('비회원은 QnA 서비스를 이용하실 수 없습니다.'); window.location.href='/login';</script>")
    }
});

//qna 질문하기 페이지
app.get("/qna/q_insert", (req, res)=>{
    if(req.user){
        res.render("QuestionSubmit", {login:req.user});
    }
    else {
        res.send("<script>alert('비회원은 QnA 서비스를 이용하실 수 없습니다.'); window.location.href='/login';</script>")
    }
});

//Qna 질문하기 DB 등록 작업
app.post("/Qsubmit", upload.array("Q_file"),(req,res)=>{
    let fileNames = [];
    if(req.files){ // 첨부파일이 있다면
        for(let i = 0; i < req.files.length; i++){
            fileNames[i] = req.files[i].filename;
            // 첨부한 파일들의 파일명만 뽑아서 배열에 옮겨담음
        }
    }
    else {
        // 첨부파일이 없어도 게시글은 등록되어야 함
        fileNames = [];
    }
    db.collection("count").findOne({'name':"qna 갯수"},(err,countResult)=>{
        db.collection("QnAs").insertOne({
            Q_num:countResult.qnaCount,
            Q_title:req.body.Q_title,
            Q_author:req.user.memberName,
            Q_date:req.body.Q_date,
            Q_context:req.body.Q_context,
            attachfile:fileNames,
            answer:false
            // 옮겨담은 배열명으로 첨부파일 수정
        },(err,result)=>{
            db.collection("count").updateOne({'name':"qna 갯수"},{$inc:{qnaCount:1}},(err,result)=>{
                res.redirect(`/qna/detail/${countResult.qnaCount}`);
            })
        })
    })
});
// qna - 답변하기(어드민 전용)
app.get("/qna/answer/:idx",(req,res)=>{
    if(req.user.role === 'ADMIN'){
        db.collection("QnAs").findOne({Q_num:Number(req.params.idx)},(err,result)=>{
            // find로 찾아온 데이터값은 result에 담긴다
            // 상세페이지 보여주기위해서 찾은 데이터값을 함께 전달한다.
            res.render("QnaAnswer", {login:req.user, data:result});
        });
    }
    else {
        res.send("<script>alert('관리자 전용 기능입니다.'); window.location.href='/';</script>")
    }
});
//Qna 답변하기 DB 등록 작업
app.post("/Aupdate", upload.array("Q_file"),(req,res)=>{
    db.collection("QnAs").findOneAndUpdate(
        // 업데이트할 문서를 찾기 위한 조건
        { Q_num: Number(req.body.A_num) },
        {
          // 업데이트할 필드와 값들을 $set 연산자를 사용하여 지정
          $set: {
            answer: true,                    
            // answer 필드를 true로 업데이트
            A_date: req.body.A_date,         
            // A_date 필드에 req.body.A_date 값을 추가
            A_num: req.body.A_num,           
            // A_num 필드에 req.body.A_num 값을 추가
            A_author: req.user.memberName,   
            // A_author 필드에 req.user.memberName 값을 추가
            A_text: req.body.A_text,          
            // A_text 필드에 req.body.A_text 값을 추가
            }
        },
        { 
          returnOriginal: false   // 업데이트된 문서를 반환하도록 설정
        },
        (err, result) => {
            if (err) {
                // 업데이트 실패 시 오류 처리
                console.error("업데이트 실패:", err);
                // 추가적인 오류 처리 로직을 구현하거나 사용자에게 알림을 제공할 수 있습니다.
                res.status(500).send("업데이트를 수행하는 동안 오류가 발생했습니다.");
            } 
            else {
                // 업데이트 성공 시 처리
                res.redirect(`/qna/detail/${req.body.A_num}`);
            }
        }
    );
});

// 게시글(단일) 삭제 처리
// 게시글 상세 페이지 -> 삭제 요청
app.get("/dbdelete/:num",(req,res)=>{
    db.collection("QnAs").deleteOne({Q_num:Number(req.params.num)},(err,result)=>{
        //게시글 삭제후 게시글 목록페이지로 요청
        res.redirect(`/qna`);
    })
})

// 게시글 전체 페이지 -> 선택삭제 요청
// 체크박스 선택한 게시글들 지우는 처리
app.get("/dbseldel",(req,res)=>{
    // delOk안에있는 문자열 데이터들을 정수데이터로 변경
    let changeNumber = [];
    req.query.delOk.forEach((item,index)=>{
        changeNumber[index] = Number(item); 
        //반복문으로 해당 체크박스 value 값 갯수만큼 숫자로 변환후 배열에 대입
    })
    //변환된 게시글 번호 갯수들만큼 실제 데이터베이스에서 삭제처리 deleteMany()
                                            //배열명에 있는 데이터랑 매칭되는 것들을 삭제
    db.collection("QnAs").deleteMany({Q_num:{$in:changeNumber}},(err,result)=>{
        res.redirect(`/qna`); //게시글 목록페이지로 요청
    })
});