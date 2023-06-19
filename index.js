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
        console.log(`서버연결 성공, 포트 번호는 ${port}`);
    });

});

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
            res.render("location.ejs", {cities:cities, citiesSort:citiesSort, stores: stores});
        })
    });
    
});