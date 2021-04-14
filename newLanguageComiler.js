const moment = require('moment-timezone');
const selectedTimeZone = 'Poland'

let tekst = `
Hej {Mama|Tata}! zycze wam sto lat z okazji
 <f get to/from 1996 August 3 y,m >
 rocznicy slubu.
`
tekst="{"+tekst+"}"

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

const functionInText = (e) => {
    e=e.replace(/get/g, "").replace(/\n/g, "")

    if(e.indexOf("to/from")!=-1){
        ar = e.replace(/to\/from/g,"").replace(/</g,"").replace(/>/g,"").split(" ").slice(1).filter(Boolean);
        // console.log(ar)
        if(ar.length>3){
            year = false
            month = false
            day = false
            let scheme = []
            months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            expectedChars = ['y','m','w','d']
            isDateValid=false
            while(ar.length>0){
                temp_=ar.pop()
                if(months.includes(temp_)){
                    for(i in months){
                        if (temp_ == months[i]){
                            month = i
                        }
                    }
                }
                else if(parseInt(temp_)<32){
                    day=parseInt(temp_)
                }
                else if(parseInt(temp_)>=1970 && parseInt(temp_)<=2100){
                    year=parseInt(temp_)
                }
                else if(temp_==="y" || temp_==="m" || temp_==="w" || temp_==="d"){
                    scheme=temp_
                }
                else if(temp_.indexOf(",")!=-1){
                    temp_=temp_.split(",").join("")
                    if(temp_.length>0){
                        [...temp_].forEach(char => {
                            if(expectedChars.includes(char) && !scheme.includes(char)){
                                scheme.push(char)
                            }
                        })
                    }
                }
            }
            
            if(year === false || month === false || day === false){
                return e
            }
            if(scheme.length==0){
                scheme=['y','m','d']
            }
            timeNow = moment(new Date()).clone().tz(selectedTimeZone);//strefa czasowa
            currentYear = timeNow.year()
            currentMonth = timeNow.month()
            dayOfTheMonth = timeNow.date()
            

            //2020 8 31
            //2021 4 14
            console.log(timeNow, currentYear, currentMonth, dayOfTheMonth)
            difference = [year-currentYear, month-currentMonth, Math.abs(day-dayOfTheMonth)]
            if(difference[0]<0){
                difference[0]++;
                difference[1]=Math.abs(difference[1]-12)
            }

            if(difference[0]==1){
                difference[0]='1 year'
            }
            else if(difference[0]>1){
                difference[0]=difference[0]+' years'
            }
            if(difference[1]==1){
                difference[1]='1 month'
            }
            else if(difference[1]>1){
                difference[1]=difference[1]+' months'
            }
            if(difference[2]==1){
                difference[2]='1 day'
            }
            else if(difference[2]>1){
                difference[2]=difference[2]+' days'
            }
            
            return difference.join(" ")
        }
    }
    return e
}

const final = (tekst) => {

    f = findfunctions(tekst);
    // console.log(f)
    i=0
    while(i<f.length){//looking for functions
        if(f[i][0]==">"){
            try {
                if(f[i-1][0]=="<"){
                    sliced = tekst.slice(f[i-1][1],f[i][1]+1)//part inside { ... }
                    if(sliced[1]=="f"){
                        // function_ = sliced.replace(/</g,"").replace(/>/g,"").split(" ")
                        // console.log(function_)
                        if(sliced.indexOf("get")!=-1){
                            tekst = tekst.replace(sliced, functionInText(sliced))
                        }
                    }
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



////years months weeks days to| years months   <f get y,m,w,d to/from 2021 August 31>