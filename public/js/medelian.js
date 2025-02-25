class Mendelian{
    get_gamates(geno){
        let tmp=[geno[0],geno[1]]
        if (geno.length==2){
            return tmp
        }else{
            let result=[]
            let to_add=this.get_gamates(geno.slice(2))
            for (let i of tmp){
                for (let j of to_add){
                    let tmp_r=i+j
                    if (!(result.includes(tmp_r))){result.push(tmp_r)}
                } 
            }
            return result
        }
    }

    punnett_square(f_geno,m_geno){
        let [male_gemates,female_gamates]=[this.get_gamates(f_geno),this.get_gamates(m_geno)]
        let result={}
        for (let i of male_gemates){
            for (let j of female_gamates){
                let tmp_r=this.fertilize(i,j)
                if (tmp_r in result){
                    result[tmp_r]+=1
                }else{
                    result[tmp_r]=1
                }
            }
        }
        return Object.keys(result)
    }

    fertilize(g1,g2){
        let result=""
        for (let i in g1){
            let tmp_r=g1[i]+g2[i]
            tmp_r=tmp_r.split("").sort().join("")
            result+=tmp_r
        }
        return result
    }

    check_legal(genome,f_genome,m_genome){
        let to_test=genome
        if (f_genome && m_genome){
            let possible_genotype=this.punnett_square(f_genome,m_genome)
            return (possible_genotype.includes(genome))
        }else if (f_genome){
            to_test=f_genome
        }else if (m_genome){
            to_test=m_genome
        }
        let intersection=genome.split("").filter(char=>to_test.split("").includes(char))
        return (intersection.length>0)
    }

    sort_genome(genome){
        let sortedgenome = genome.split('').sort((a, b) => {
            if (a.toUpperCase() === b.toUpperCase()) {
                return b.localeCompare(a);
            }
            return a.toUpperCase().localeCompare(b.toUpperCase());
        }).join('');
        return sortedgenome
    }
}
let mendelian=new Mendelian()
module.exports=mendelian