let tekst = `
Hej <f >{
    Skarbie|
    Kocha{Sk<arb>ie|Kochanie|Motylku}nie|
    Motylku}!
Mam nadzieje, ze czujesz sie cudownie
`

const findallspecialchars = (e) => {
    let ar = []
    for (let i=0; i<e.length; i++){
        if (e[i]=='{' || e[i]=='}'){
            ar.push([e[i],i])
        }
    }
    return ar
}

const findfunctions = (e) => {
    let ar = []
    for (let i=0; i<e.length; i++){
        if (e[i]=='<' || e[i]=='>'){
            ar.push([e[i],i])
        }
    }
    return ar
}

const final = (tekst) => {

    f = findfunctions(tekst);
    console.log(f)
    i=0
    while(i<f.length){//looking for functions
        if(f[i][0]==">"){
            try {
                if(f[i-1][0]=="<"){
                    sliced = tekst.slice(f[i-1][1],f[i][1]+1)//part inside { ... }
                    if(sliced[1]=="f"){
                        console.log("funkcja: ",sliced)
                    }
                    // tekst = tekst.replace(sliced, "dsa")
                    i++
                }
            } catch (error) {
                i++
            }
        }
        else{
            i++
        }
    }

    e = findallspecialchars(tekst);
    
    
    {//fixing too many "{" or "}"
        start=0
        end=0
        level=0
        i=0
        while (true){
            try {
                if(e[i][0]=="{"){
                    level++;
                }
            } catch (error) {
                tekst=tekst+"}".repeat(level)
                break
            }
            if(e[i][0]=="}"){
                level--;
                if(level<0){
                    tekst="{"+tekst
                    i=0
                    e = findallspecialchars(tekst);
                }
            }
            i++
        }
    }
    
    i=0
    while(i<e.length){//randomly choosing options for final result
        if(e[i][0]=="}"){
            sliced = tekst.slice(e[i-1][1]+1,e[i][1])//part inside { ... }
            options = sliced.split("|")
            temp_=options[Math.floor(Math.random() * options.length)]//radnomly choose an option: 1 | 2 | 3...

            tekst=(tekst.slice(0,e[i-1][1])+temp_+tekst.slice(e[i][1]+1,tekst.length)) // new text 

            e = findallspecialchars(tekst); //get new build.
            i=i-2
        }
        i++
    }

    {//deleting empty spaces
        tekst=tekst.split("\n").join(" ")
        while(tekst.indexOf("  ")!=-1){
            tekst=tekst.split("  ").join(" ")
        }
        tekst=tekst.trim()
    }
    return tekst;
}

console.log(final(tekst));