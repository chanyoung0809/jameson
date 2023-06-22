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
        console.log(`서버연결 성공, http://localhost:${port} 로 접속하세요`);
    });

});

// 메인 페이지
app.get("/",(req,res)=>{
    db.collection("whiskey").find().toArray((err, whiskey)=>{
        db.collection("recipe").find().toArray((err, recipe)=>{
            let recipes = [];
            for(let i=0; i<recipe.length; i+=3){
                recipes.push(recipe[i]);
            }
            res.render("index", {whiskey:whiskey, recipes:recipes})
        });
    });
    
});

// 위스키 전체목록 페이지
app.get("/collections",(req,res)=>{
    res.render("collections.ejs");
});
// 위스키 상세 페이지
app.get("/product/:link", (req, res)=>{
    db.collection("whiskey").findOne({link:req.params.link}, (err, prdResult)=>{
        db.collection("recipe").find({whiskey : req.params.link}).toArray((err, result)=>{
            res.render("detail.ejs", {data:prdResult, cocktails:result});
        })
    })
})

// 레시피 전체 목록
app.get("/recipes",(req,res)=>{
    db.collection("recipe").find().toArray((err, recipes)=>{
        db.collection("whiskey").find().toArray((err, whiskey)=>{
            res.render("recipes",{recipes:recipes, whiskey:whiskey});
        })  
    })
});
// 레시피 전체 목록을 위스키별로 분류했을 때 페이지
app.get("/recipes/:link",(req,res)=>{
    db.collection("whiskey").find().toArray((err, whiskey)=>{
        db.collection("recipe").find({"whiskey":req.params.link}).toArray((err, recipes)=>{
            res.render("recipes",{recipes:recipes, whiskey:whiskey});
        })
    })    
});
// 레시피 상세페이지
app.get("/recipe/:link",(req,res)=>{
    db.collection("recipe").findOne({"link":req.params.link}, (err, recipe)=>{
        db.collection("recipe").find().toArray((err, allRecipes)=>{
            res.render("recipeDetail",{recipe:recipe, allRecipes:allRecipes});
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
            res.render("location.ejs", {cities:cities, citiesSort:citiesSort, stores: stores,test:"noselect"});
        })
    });
});

//매장명,지역검색 db요청
app.get("/storelocation",(req,res)=>{
    // 지역명으로 검색한 경우
   
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
                        test:req.query.storeLegion
                    })
                })
            }
            //지역명 선택안한경우 -> 매장 목록 페이지 경로로 요청
            else {
                res.redirect("/location");
            }
        });
    
    // 매장명으로 검색한 경우, 

    // 입력값이 정의되었고, 해당 정규식을 통과하였을 경우
   
        // 정규표현식에 맞게 검색한 경우

})


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
                    test:stores[0].engName
                })
            }
            else {
                res.render("location.ejs",{
                    cities:cities, 
                    citiesSort:citiesSort,
                    stores: undefined,
                    test: "noselect"
                })
            }
        })
    });
})

// 히스토리 페이지
app.get("/history",(req,res)=>{
    db.collection("history").find().toArray((err, history)=>{
        res.render("history", {history:history});
    })
});
// 양조장 페이지
app.get("/craft",(req,res)=>{
    db.collection("craft").find().toArray((err, craft)=>{
        res.render("craft", {craft:craft});
    })
});
// 성인인증 페이지
app.get("/validAdult",(req,res)=>{
    res.render("validAdult");
});