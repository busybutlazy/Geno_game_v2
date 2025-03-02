// const protocol = require("./protocol");

const socket = io.connect();
var mynickname=null;// set at protocol.request.NICKNAME
var whos_turn=null;// change at protocol.response.UPDATE_INFO
var opponent_name=null;// set at protocol.response.OPPONENT

var page_1=["user_name_txt","user_name","login_btn","loading_pic"]
var page_2=["send_ans_btn","pedigree"]
var ids=["A1","A2","A3","A4","B1","B2","B3","B4","B5","C1","C2","C3","C4"];
var page_3=["user_ans_id_txt","user_ans_id","user_ans_txt","user_ans","ans_btn","pedigree"]


// test function to print from server.
const originalOn = socket.on;
socket.on=function(event,callback){
    console.log(`[DEBUG] Event received: ${event}`);
    return originalOn.call(this,event,(...args)=>{
        console.log(`[DEBUG] Data for ${event}:`, args);
        callback(...args);
    });
}


function setting_listener(){
    console.log("🔄 設定 WebSocket 監聽事件...");
    socket.on('connect', () => {
        console.log("✅ 連線成功！Socket ID:", socket.id);
    });
    socket.on(protocol.response.OPPONENT_LEFT,()=>{
        console.log("對手斷線了")
        show(protocol.response.OPPONENT_LEFT)
        socket.disconnect();
    })
    socket.on(protocol.response.OPPONENT,(data)=>{
        console.log("opponent_name=",data["opponent"])
        opponent_name=data["opponent"];
        set_info2("請填入我方的族譜『基因型』; AA或Aa或aa")
        page_manager(page_2,page_1);
        set_pedigree_id.call();
    })
    
    socket.on(protocol.response.WAITING,(data)=>{
        console.log("🟡 Received WAITING from server", data);
        document.getElementById("loading_pic").hidden=false;
        show(protocol.response.WAITING);
    })
    socket.on(protocol.response.PERSON_INVALID,(data)=>{
        let wrong=data["wrong_guy"]
        set_info2(`${wrong}`+"有誤")
        show("PERSON_INVALID")
    })
    
    socket.on(protocol.response.SET_VALID,()=>{
        for (let id of ids){
            document.getElementById(id).disabled=true;
        }
        set_info2("設置完成，等待對手....")
    })
    
    socket.on(protocol.response.SET_ERROR,()=>{
        set_info2("輸入的基因型有誤")
        
    })
    socket.on(protocol.response.GAME_INIT,()=>{
        show("GAME_INIT")
    })
    socket.on(protocol.response.GAME_START,()=>{
        page_manager(page_3,page_2)
    })
    socket.on(protocol.response.GAME_END,(data)=>{
        let winner= data["winner"]
        set_info1("遊戲結束！！"+"<br>")
        set_info2("贏家是"+winner)
        page_manager([],page_3)
        page_manager([],[])
    })
    socket.on(protocol.response.NOT_YOUR_TURN,()=>{
        set_info1("不是你的回合，不要亂按！！")
    })

    socket.on(protocol.response.ANSWER_VALID,()=>{
        set_info1(produce_info("你","對方","","答對了！！"))
    })
    socket.on(protocol.response.ANSWER_INVALID,()=>{
        set_info1(produce_info("噗噗～<br>你","好險！<br>對方","","答錯了！！<br>攻守交換"))
    })
    socket.on(protocol.response.ALREADY_HIT,()=>{
        set_info1("這格已經輸入過了！！")
    })
    socket.on(protocol.response.OPPONENT_LEFT,()=>{
        set_info1("對方棄權")
        set_info2("你贏了!!")

    })
    
    socket.on(protocol.response.UPDATE_INFO,(data)=>{
        whos_turn=data["whos_turn"]
        let score=data["score"]
        info=produce_info("你","對手","","的回合"+"<br>"+"比分"+Object.values(score)[0]+" : "+Object.values(score)[1]);
        // set_info2(whos_turn+"的回合"+"<br>"+"比分"+Object.values(score)[0]+" : "+Object.values(score)[1]);
        set_info2(info);
        clean_pedigree();
        set_pedigree_id.call();
        show_pedigree(data["pedigree_to_show"])
    })
}

function produce_info(str1,str2,commonHead="",commonTail=""){
    //str1 is for user's turn. str2 is for opponent's turn.
    let txt = commonHead;
    console.log("mynickname:",mynickname)
    console.log("whos_turn:",whos_turn)
    console.log("equal?",mynickname===whos_turn)
    if (mynickname===whos_turn){txt+=str1}else{txt+=str2}
    txt+=commonTail;
    console.log(txt)
    return txt
}


function send_nickname(){
    var name=document.getElementById("user_name").value;
    console.log(name);
    // document.getElementById("info").innerHTML=name;
    socket.emit(protocol.request.NICKNAME,{'name':name});
    mynickname=name;
    set_info2("尋找對手中.....");
    page_manager(["info1","info2"],page_1)
    document.getElementsByClassName("page_1")[0].style.zIndex = 1;
    // document.getElementById("user_name").disabled=true;
};

function send_set_answer(){
    console.log("start send set answer.")
    let ans={};
    for (let id of ids){
        ans[id]=document.getElementById(id).value
    }
    // let answer={"ans":{'A1':"Aa","A2":"Aa","A3":"aa","A4":"aa","B1":"Aa","B2":"AA","B3":"aa","B4":"aa","B5":"aa","C1":"Aa","C2":"Aa","C3":"Aa","C4":"Aa"}}
    try{
        socket.emit(protocol.request.SET_ANSWER,{"ans":ans})
    } catch{
        console.error("empty!")
    }
}


function send_answer(){
    var ans=document.getElementById("user_ans").value;
    console.log("ans=",ans)
    var ans_id=document.getElementById("user_ans_id").value;
    console.log()
    socket.emit(protocol.request.ANSWER,{id:ans_id,genotype:ans})
}


function show(txt){
    socket.emit(protocol.request.CONSOLE_LOG,{"txt":`form client :${txt}`})
}

function page_manager(show,hidden){
    for (let target of hidden){
        document.getElementById(target).hidden=true;
    }
    for (let target of show){
        document.getElementById(target).hidden=false;
    }
}

function set_info1(txt){
    document.getElementById("info1").innerHTML=txt;
}

function set_info2(txt){
    document.getElementById("info2").innerHTML=txt;
}

function clean_pedigree(){
    for (let id of ids){
        document.getElementById(id).value="";
    }
}

function set_pedigree_id(){
    for (let id of ids){
        document.getElementById(id).value=String(id);
    }
}
function show_pedigree(p2show){
    let keys=Object.keys(p2show);
    for (let key of keys){
        document.getElementById(key).value=p2show[key];
    }
}

function setText(input) {
    if (input.value === input.id) {
        input.value = "";  // 清空輸入框
    }
}

function restoreText(input) {
    if (input.value.trim() === "") {
        input.value = input.id;  // 恢復預設文字
    }
}

function clearText(input) {
    if (input.value === input.id) {
        input.value = "";  // 清空輸入框
    }
}

function restoreText(input) {
    if (input.value.trim() === "") {
        input.value = input.id;  // 恢復預設文字
    }
}