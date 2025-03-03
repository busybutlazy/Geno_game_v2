const Individual=require('./individual_bean')
class Pedigree_builder{
    constructor(relationships=null){
        if (!relationships){
            this.members=this.build_default_pedigree()
            this.valid_genotype=["AA","Aa","aa"];
        }else{
            this.members=this.build_custom_pedigree(relationships);
            this.valid_genotype=null;
            // 需要再手動設定可行的genotype 之後再改吧 呵呵
            // [dictionary] 一定要從父母寫到小孩 不然會爆掉
        }
        this.members_list=Object.keys(this.members);
        // console.log("this.members_list=",this.members_list)
    }
    get_number_of_members(){
        return this.members_list.length
    }


    build_custom_pedigree(data_list){
        let members={}
        for (let i=0; i<data_list.length;i++){
            if ("father" in data_list[i]){
                data_list[i]["father"]=members[data_list[i]["father"]]
            }
            if ("mother" in data_list[i]){
                data_list[i]["mother"]=members[data_list[i]["mother"]]
            }
            members[data_list[i]["id"]]=new Individual(data_list[i])
        }
        return members
    }

    build_default_pedigree(){
        return this.build_custom_pedigree([{id:"A1",gender:true}
                            ,{id:"A2",gender:false}
                            ,{id:"A3",gender:true}
                            ,{id:"A4",gender:false}
                            ,{id:"B1",gender:false,father:"A1",mother:"A2"}
                            ,{id:"B2",gender:true,father:"A1",mother:"A2"}
                            ,{id:"B3",gender:false,father:"A3",mother:"A4"}
                            ,{id:"B4",gender:true,father:"A3",mother:"A4"}
                            ,{id:"B5",gender:true,father:"A3",mother:"A4"}
                            ,{id:"C1",gender:true,father:"B2",mother:"B3"}
                            ,{id:"C2",gender:false,father:"B2",mother:"B3"}
                            ,{id:"C3",gender:false,father:"B2",mother:"B3"}
                            ,{id:"C4",gender:true,father:"B2",mother:"B3"}])
    }

    #set_single_individual_genotype(id,genotype,pedigree){
        
        
        return pedigree[id].set_genotype(genotype);
    }

    set_ans_genotype(ans_dict){
        // wrong_type_1=輸入的數量不對
        // wrong_type_2=輸入的某人錯誤
        if (Object.keys(ans_dict).length!=Object.keys(this.members).length){
            // 應該多檢查一項 填入的內容
            console.log("wrong number of ans")
            return {wrong_type:"wrong_type_1"};
        }
        return this.set_everyone(ans_dict)
    }
    set_everyone(ans_dict){
        let result=true
        for (let [id,genotype]of Object.entries(ans_dict)){
            if (!(this.valid_genotype.includes(genotype))){
                result={wrong_type:"wrong_type_1"};
            }
            // let wrong_guy;
            if ((genotype.length!=2) || (this.#set_single_individual_genotype(id,genotype,this.members))){
            // if (wrong_guy){
                result={wrong_type:"wrong_type_2",wrong_guy:id}
            }
        }
        return result
    }

    check_ans(id,genotype){
        if (!(this.members_list.includes(id))){
            return false;
        }
        return this.members[id].genotype==genotype
    }
}

// ped=new Pedigree_builder();
// ped.set_ans_genotype({'A1':"AA","A2":"Aa","A3":"aa","A4":"aa","B1":"Aa","B2":"AA","B3":"aa","B4":"aa","B5":"aa","C1":"Aa","C2":"Aa","C3":"Aa","C4":"Aa"})
// // console.log(ped.our_ans)
// console.log(ped.members["B1"].father.id)
// console.log(ped.check_ans("A1","Aa"))
module.exports=Pedigree_builder