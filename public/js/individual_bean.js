const mendelian =require('./medelian.js')
class Individual{
    constructor({id,gender,father=null,mother=null
        ,genotype=null,phenotype=null}){
        this.id=id;
        this.gender=gender;
        this.father=null;
        if (father!=null){
            this.set_Parent(father);
        }
        this.mother=null;
        if (mother!=null){
            this.set_Parent(mother);
        }
        this.children=[]
        
        if (genotype!=null){
            this.set_genotype(genotype)
        }
        this.phenotype=phenotype
    }

    set_Parent(p){
        let result=true
        if(p.gender){
            if (this.father){
                console.log(`${this.id} : Father is already exist.`);
                result= false;
            }else{
                this.father=p
                p.add_child(this)
            }
        }else{
            if (this.mother){
                console.log(`${this.id} : Mother is already exist.`);
                result= false;
            }else{
                this.mother=p
                p.add_child(this)
            }
        }
        return result;
    }

    get_children_id(){
        let child_list=[]
        for (let child of this.children){
            child_list.push(child.id)
        }
        return child_list
    }
    add_child(child){
        if (this.children.includes(child)){
            console.log("Child already exists")
            return false
        }else{
            this.children.push(child)
            return true
        }
    }

    set_genotype(genotype){
        // 正確不會回傳值 錯的話會回傳錯誤的人名        
        genotype=mendelian.sort_genome(genotype)
        if (this.check_legal_myself(genotype)){
            this.genotype=genotype
        }else{
            console.log(`${this.id} : not a legal genotype`)
            return this.id
        }
    }

    set_phenotype(phenotype){
        this.phenotype=phenotype
    }

    check_legal_myself(gene){
        let [f_geno,m_geno]=this.get_parent_genotype()
        // console.log([f_geno,m_geno])
        return mendelian.check_legal(gene,f_geno,m_geno)
    }


    get_parent_genotype(){
        return [this.gpgh(this.father),this.gpgh(this.mother)]
    }

    gpgh(p){
        // get_parent_genotype_helper as gpgh
        let genome=null
        try{
            genome=p.genotype
        }catch{
            // console.log(`Genotype is unknown.`);
        }
        return genome;
    }

}

// let Aa1=new Individual({id:"Aa1",gender:true,genotype:"AABbCc"})
// let Aa2=new Individual({id:"Aa2",gender:false,genotype:"AaBbCC"})
// let Aa3=new Individual({id:"Aa3",gender:true,genotype:"aaBbCc"})
// let Aa4=new Individual({id:"Aa4",gender:false,genotype:"AaBBCC"})
// let Ab1=new Individual({id:"Ab1",gender:true,genotype:"AABBCC",father:Aa1,mother:Aa2})
// let Ab2=new Individual({id:"Ab2",gender:false,genotype:"aaBBCC",father:Aa3,mother:Aa4})


module.exports=Individual