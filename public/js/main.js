const Pedigree_builder=require('./pedigree')
const protocol=require('./protocol')

class Game{
    constructor(player1,player2,id2name){
        this.mode_dict=[];
        // 未來可以添加多種模式
        this.player_pedigree={};
        this.players=[player1,player2];
        this.next=null;
        this.hit={};
        this.hit[player1]={};
        this.hit[player2]={};
        this.opponent={};
        this.opponent[player1]=player2;
        this.opponent[player2]=player1;
        this.goal=0;
        this.now_turn=null;
        this.turn_counter=0;
        this.input={};
        this.id2name=id2name;
    }

    init_game(mode){
        console.log("now at init_game")
        if (!(mode in this.mode_dict)){mode=null;console.log("mode is not in mode_dict")}
        for (let player of this.players){
            this.player_pedigree[player]=new Pedigree_builder(mode);
            this.goal=this.player_pedigree[player].get_number_of_members();
            this.input[player]=false;
        }
        this.#who_first_by_random()
        
    }

    set_ans(player,data){
        // 輸入基因形式
        console.log("now at set_ans")
        // console.log(this.player_pedigree)
        let rsp=this.player_pedigree[player].set_ans_genotype(data["ans"])
        let result=null;
        if (rsp==true){
            result=this.#stsf(protocol.response.SET_VALID,null,[player])
            this.input[player]=true;
        }else if(rsp["wrong_type"]=="wrong_type_1"){
            result=this.#stsf(protocol.response.SET_ERROR,null,[player])
        }else if (rsp["wrong_type"]=="wrong_type_2"){
            result=this.#stsf(protocol.response.PERSON_INVALID,{wrong_guy:rsp["wrong_guy"]},[player])
        }
        return result
    }

    all_set(){
        return this.input[this.players[0]]&&this.input[this.players[1]]
    }

    game_start(){
        this.next=this.guess_genotype
    }

    #who_first_by_random(){
    // 決定誰先開始 先用random的方式 之後可用剪刀石頭布
        console.log("now at #who_first_by_random")
        let tmp=Math.random()    
        // console.log(tmp)
        let result;
        if (tmp>0.5){
            console.log("player 1 first")
            result=this.players[0]
        }else{
            console.log("player 2 first")
            result=this.players[1]
        }
        this.now_turn=result
    };

    game_alive(){
        return (Object.keys(this.hit[this.players[0]]).length<this.goal && Object.keys(this.hit[this.players[1]]).length<this.goal)

    }

    

    guess_genotype({player,id,genotype}){
        id=id.toUpperCase();
        // format {player,id,genotype}
        console.log("now at guess_genotype")
        // 猜對面的基因型
        console.log(`${player} guess ${id} = ${genotype}`)
        let result=null
        if (player!=this.now_turn){
            result=this.#stsf(protocol.response.NOT_YOUR_TURN,null,[player])
        }else if (Object.keys(this.hit[player]).includes(id)){
            // 已經答過了
            result=this.#stsf(protocol.response.ALREADY_HIT,null,this.players);
        }else if(this.player_pedigree[this.opponent[player]].check_ans(id,genotype)){
            // 答案正確
            this.hit[player][id]=genotype
            result=this.hit_process(player)
        }else{
            // 答案錯誤
            result=this.#stsf(protocol.response.ANSWER_INVALID,null,this.players);
            // 攻守交換
            this.now_turn=this.opponent[this.now_turn]
            this.turn_counter=0;
        }
        return result
    };
    
    hit_process(player){
        let result=null;
        if (this.game_alive()){
            console.log("game alive? ",this.game_alive())
            this.turn_counter+=1
            if (this.turn_counter>=3){
                this.now_turn=this.opponent[this.now_turn];
                this.turn_counter=0;
            }
            result=this.#stsf(protocol.response.ANSWER_VALID,null,this.players)
        }else{
            result=this.#stsf(protocol.response.GAME_END,{winner:this.id2name[player]},this.players)
        }
        return result
    }

    #stsf(r_type,data,target){
        // send_to_server_format as stsf
        // r_type從protocol來 data為{} target為[]
        return {r_type:r_type,data:data,target:target}
    }


    update_info(){
        let p1=this.players[0]
        let p2=this.players[1]
        let result={
            score:{},
            // 雙方比分
            now_turn:this.now_turn,
            whos_turn:this.id2name[this.now_turn],
            // 誰的回合
            pedigree_to_show:this.hit[this.now_turn],
            // 要顯示在雙方的族譜
            turn_counter:this.turn_counter,
        }
        result["score"][p1]=Object.keys(this.hit[p1]).length;
        result["score"][p2]=Object.keys(this.hit[p2]).length;
        return this.#stsf(protocol.response.UPDATE_INFO,result,[p1,p2])
    }

    end_game(){
        console.log("end game")
    };


}




module.exports=Game;