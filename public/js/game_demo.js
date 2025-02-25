const Game = require('./main')

// server 拿到兩方的nick name 開始遊戲
let game=new Game("Mike","Andy");
game.init_game()
// 回傳protocol.response.GAME_INIT 切換到輸入頁面
// 兩方玩家各自回傳protocol.request.SET_ANSWER
game.set_ans("Andy",{"ans":{'A1':"Aa","A2":"Aa","A3":"aa","A4":"aa","B1":"Aa","B2":"AA","B3":"aa","B4":"aa","B5":"aa","C1":"Aa","C2":"Aa","C3":"Aa","C4":"Aa"}})
game.set_ans("Mike",{"ans":{'A1':"Aa","A2":"Aa","A3":"aa","A4":"aa","B1":"Aa","B2":"AA","B3":"aa","B4":"aa","B5":"aa","C1":"Aa","C2":"Aa","C3":"Aa","C4":"Aa"}})
// 一方設定完畢 回傳true 當兩方都設定完畢(server判斷) 開始遊戲流程 
// protocol.response.GAME_START 切換到遊戲頁面
game.game_start()
let now_info=game.update_info()
console.log(now_info)
// protocol.response.UPDATE_INFO 確認回合以及盤面狀況
// protocol.request.ANSWER 請求對答案
console.log(game.next({"player":now_info["data"]["now_turn"],"id":"A1","genotype":"Aa"}))
now_info=game.update_info()
console.log(game.update_info())
console.log(game.next({"player":now_info["data"]["now_turn"],"id":"A2","genotype":"Aa"}))
now_info=game.update_info()
console.log(game.update_info())
console.log(game.next({"player":now_info["data"]["now_turn"],"id":"A3","genotype":"aa"}))
now_info=game.update_info()
console.log(game.update_info())
console.log(game.next({"player":game.opponent[now_info["data"]["now_turn"]],"id":"A1","genotype":"Aa"}))
now_info=game.update_info()
console.log(game.update_info())
console.log(game.next({"player":now_info["data"]["now_turn"],"id":"A2","genotype":"Aa"}))
now_info=game.update_info()
console.log(game.update_info())
console.log(game.next({"player":now_info["data"]["now_turn"],"id":"A3","genotype":"aa"}))
now_info=game.update_info()
console.log(game.update_info())