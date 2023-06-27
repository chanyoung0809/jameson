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
                    memberphone:`${req.body.memberphone[0]}-${req.body.memberphone[1]}-${req.body.memberphone[2]}`, // 핸드폰 번호
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
        let citiesSort = cities.slice(); //배열 복제본
        // cities.clone() 안먹는 이유?
        citiesSort = citiesSort.sort((a, b)=>{
            // 오름차순 정렬한 새로운 배열 생성
            if(a.korName > b.korName) return 1;
            if(a.korName < b.korName) return -1;
            return 0;
        });
        db.collection("store").find().toArray((err, stores)=>{    
            res.render("location.ejs", {cities:cities, citiesSort:citiesSort, stores: stores, login:req.user, test:"noselect"});
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
                    login:req.user
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
                    login:req.user
                })
            }
            else {
                res.render("location.ejs",{
                    cities:cities, 
                    citiesSort:citiesSort,
                    stores: undefined,
                    test: "noselect",
                    login:req.user
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
app.get("/qna",(req,res)=>{
    if(req.user){
        res.render("QnA", {login:req.user});
    }
    else {
        res.send("<script>alert('비회원은 QnA 서비스를 이용하실 수 없습니다.'); window.location.href='/login';</script>")
    }
});

// Qna 상세 글 페이지 - 공지사항
app.get("/qna/detail/notice",(req,res)=>{
    res.render("QnaNotice", {login:req.user});
});

// Qna 상세 글 페이지 - 상세 글
app.get("/qna/detail/:idx",(req,res)=>{
    db.collection("QnAs").findOne({num:Number(req.params.idx)},(err,result)=>{
        //find로 찾아온 데이터값은 result에 담긴다
        //상세페이지 보여주기위해서 찾은 데이터값을 함께 전달한다.
        res.render("QnaDetail", {login:req.user, data:result});
    });
});

//qna 질문하기 페이지
app.get("/qna/q_insert", (req, res)=>{
    res.render("QuestionSubmit", {login:req.user});
});

//Qna 질문하기 DB 등록 작업
app.post("/Qsubmit",upload.array("QnAs"),(req,res)=>{
    let fileNames = [];
    if(req.files){ // 첨부파일이 있다면
        for(let i = 0; i < req.files.length; i++){
            fileNames[i] = req.files[i].filename;
            // 첨부한 파일들의 파일명만 뽑아서 배열에 옮겨담음
        }
    }
    else {
        // 첨부파일이 없어도 게시글은 등록되어야 함
    }
    db.collection("count").findOne({name:"qna갯수"},(err,countResult)=>{
        db.collection("QnAs").insertOne({
            Q_num:countResult.qnaCount,
            Q_title:req.body.Q_title,
            Q_author:req.body.Q_author,
            Q_date:req.body.Q_date,
            Q_context:req.body.Q_context,
            attachfile:fileNames,
            // 옮겨담은 배열명으로 첨부파일 수정
        },(err,result)=>{
            db.collection("count").updateOne({name:"qna갯수"},{$inc:{qnaCount:1}},(err,result)=>{
                res.redirect(`/qna/detail/${countResult.qnaCount}`);
            })
        })
    })
});
