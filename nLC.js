const moment = require('moment-timezone');
const selectedTimeZone = 'America/Chicago'

let tekst = `
Hej {Mama|Tata}! zycze wam sto lat z okazji
 <to 1925 yn>
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

const functionTo = (e) => {
    timeNow = moment(new Date()).tz(selectedTimeZone).hours(12).minutes(0).seconds(0).milliseconds(0);//strefa czasowa
    e=e.replace(/\n/g, " ")
    ar = e.toLowerCase().replace(/to/g,"").replace(/\//g,"").replace(/from/g,"").replace(/</g,"").replace(/>/g,"").replace(/,/g,"").replace(/\./g,"").split(" ").slice(1).filter(Boolean);
    months=['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
    {//varibles
        year = false
        month = false
        day = false
        temp_y=false;
        temp_m=false;
        temp_w=false;
        temp_d=false;
        expressIn="";
        isPast=false
        upperCase=false
        onlyYN=false
    }

    for (i in ar){
        if(day == false){
            if(ar[i]<32 && ar[i]>0){
                day=ar[i]
            }
        }
        if(year == false){
            if(ar[i]>1900 && ar[i]<2100){
                year=ar[i]
            }
        }
        if(month == false){
            for(j in months){
                if(ar[i]==months[j]){
                    month=j
                }
            }
        }
        if(temp_y==false && temp_m==false && temp_w==false && temp_d==false){
            for(char of ar[i].toLowerCase()){
                if(char.charCodeAt()>=97 && char.charCodeAt()<=122){
                    if(char == 'y'){
                        temp_y=true
                    }
                    else if(char == 'm'){
                        temp_m=true
                    }
                    else if(char == 'w'){
                        temp_w=true
                    }
                    else if(char == 'd'){
                        temp_d=true
                    }
                    else{
                        temp_y=false
                        temp_m=false
                        temp_w=false
                        temp_d=false
                        break
                    }
                }
            }
        }
        if(upperCase==false){
            if(ar[i].toLowerCase().indexOf('uppercase')!=-1){
                upperCase=true
            }
        }
        if(onlyYN==false){
            if(ar[i].toLowerCase().indexOf('yn')!=-1 || ar[i].toLowerCase().indexOf('ny')!=-1){
                onlyYN=true
            }
        }        
    }
    if(onlyYN==true && year!=false){
        if(year<timeNow.year()){
            return " "+timeNow.year()-year+" "
        }
        else{
            return " "+year-timeNow.year()+" "
        }
    }

    {//make expressIn varible
        if(temp_y==true){
            expressIn+='y'
        }
        if(temp_m==true){
            expressIn+='m'
        }
        if(temp_w==true){
            expressIn+='w'
        }
        if(temp_d==true){
            expressIn+='d'
        }
        if(expressIn.length==0){
            expressIn="ymd"
        }
    }
    
    if(year==false || month==false || day==false){
        console.log('Please enter year, month and a day you want count down to')
        return e
    }
    
    {
        targetDate=moment(timeNow)
        targetDate=targetDate.year(year).month(month)
        if(targetDate.daysInMonth()<day){
            console.log('Date is not valid')
            return e
        }
        targetDate=targetDate.date(day)
    }
    
    daysToXinTotal=targetDate.diff(timeNow,'days')//Days in Total to THE date
    if(daysToXinTotal<0){//if past date reverse
        isPast=true
        temp=moment(timeNow)
        timeNow=moment(targetDate)
        targetDate=moment(temp)
        daysToXinTotal=targetDate.diff(timeNow,'days')
    }
    monthsToXinTotal=targetDate.diff(timeNow,'months')//Months in Total to THE date
    monthsToX=monthsToXinTotal%12//Months to THE date
    target=targetDate.year(targetDate.year()+timeNow.diff(targetDate,'years'))
    daysToX=targetDate.diff(timeNow,'days')//Days to THE date
    yearsToX=Math.floor(monthsToXinTotal/12)//Years to THE date
    response = ""
    temp=[]
    
    if(expressIn=='y'){
        if(yearsToX==1){
            response+="a year "
        }
        else{
            response+=yearsToX+" years "
        }
    }
    else if(expressIn=='m'){
        if(monthsToXinTotal==1){
            response+="a month "
        }
        else{
            response+=monthsToXinTotal+" months "
        }
    }
    else if(expressIn=='w'){
        weeksToXinTotal=Math.floor(daysToXinTotal/7)
        if(weeksToXinTotal==1){
            response+="a week "
        }
        else{
            response+=weeksToXinTotal+" weeks "
        }
    }
    else if(expressIn=='d'){
        if(daysToXinTotal==1){
            response+="a day "
        }
        else{
            response+=daysToXinTotal+" days "
        }
    }
    else if(expressIn=='ym'){
        if(yearsToX==0){}
        else if(yearsToX==1){
            response+="a year "
        }
        else{
            response+=yearsToX+" years "
        }
        if(response.length!=0 && monthsToX==0){}
        else if(monthsToX==1){
            if(response!=0){
                response+="and "
            }
            response+="a month "
        }
        else{
            if(response!=0){
                response+="and "
            }
            response+=monthsToX+" months "
        }
    }
    else if(expressIn=='yw'){
        if(yearsToX==0){}
        else if(yearsToX==1){
            response+="a year "
        }
        else{
            response+=yearsToX+" years "
        }
        if(response.length!=0 && Math.floor(daysToX/7)==0){}
        else if(Math.floor(daysToX/7)==1){
            if(response!=0){
                response+="and "
            }
            response+="a week "
        }
        else{
            if(response!=0){
                response+="and "
            }
            response+=Math.floor(daysToX/7)+" weeks "
        }
    }
    else if(expressIn=='yd'){
        if(yearsToX==0){}
        else if(yearsToX==1){
            response+="a year "
        }
        else{
            response+=yearsToX+" years "
        }
        if(response.length!=0 && daysToX==0){}
        else if(daysToX==1){
            if(response!=0){
                response+="and "
            }
            response+="a day "
        }
        else{
            if(response!=0){
                response+="and "
            }
            response+=daysToX+" days "
        }
    }
    else if(expressIn=='mw'){
        if(monthsToXinTotal==0){}
        else if(monthsToXinTotal==1){
            response+="a month "
        }
        else{
            response+=monthsToXinTotal+" months "
        }
        timeNow=timeNow.month(timeNow.month()+monthsToX)
        weeksToX=targetDate.diff(timeNow,'weeks')
        if(response.length!=0 && Math.floor(daysToX/7)==0){}
        else if(weeksToX==1){
            if(response!=0){
                response+="and "
            }
            response+="a week "
        }
        else{
            if(response!=0){
                response+="and "
            }
            response+=weeksToX+" weeks "
        }
    }
    else if(expressIn=='md'){
        if(monthsToXinTotal==0){}
        else if(monthsToXinTotal==1){
            response+="a month "
        }
        else{
            response+=monthsToXinTotal+" months "
        }
        timeNow=timeNow.month(timeNow.month()+monthsToX)
        daysToX=targetDate.diff(timeNow,'days')
        if(response.length!=0 && daysToX==0){}
        else if(daysToX==1){
            if(response!=0){
                response+="and "
            }
            response+="a day "
        }
        else{
            if(response!=0){
                response+="and "
            }
            response+=daysToX+" days "
        }
    }
    else if(expressIn=='wd'){
        if(Math.floor(daysToXinTotal/7)==0){}
        else if(Math.floor(daysToXinTotal/7)==1){
            response+="a week "
        }
        else{
            response+=Math.floor(daysToXinTotal/7)+" weeks "
        }
        if(response.length!=0 && daysToXinTotal%7==0){}
        else if(daysToXinTotal%7==1){
            if(response!=0){
                response+="and "
            }
            response+="a day "
        }
        else{
            if(response!=0){
                response+="and "
            }
            response+=daysToXinTotal%7+" days "
        }
    }
    else if(expressIn=='mwd'){
        if(monthsToXinTotal==1){
            temp.push('a month')
        }
        else if(monthsToXinTotal>1){
            temp.push(monthsToXinTotal+' months')
        }
        timeNow=timeNow.month(timeNow.month()+monthsToX)
        daysToX=targetDate.diff(timeNow,'days')
        console.log(daysToX)
        if(Math.floor(daysToX/7)==1){
            temp.push('a week')
        }
        else if(Math.floor(daysToX/7)>1){
            temp.push(Math.floor(daysToX/7)+' weeks')
        }
        if(daysToX%7==1){
            temp.push('a day')
        }
        else if(daysToX%7>1){
            temp.push(daysToX%7+' days')
        }
        temp.reverse()
        while(temp.length>0){
            if(temp.length>2){
                response+=temp.pop()+", "
            }
            else if(temp.length==2){
                response+=temp.pop()+" and "
            }
            else{
                response+=temp.pop()
            }
        }
        if(response.length=""){
            response="0 days"
        }
    }
    else if(expressIn=='ywd'){
        if(yearsToX==1){
            temp.push('a year')
        }
        else if(yearsToX>1){
            temp.push(yearsToX+' years')
        }
        if(Math.floor(daysToX/7)==1){
            temp.push('a week')
        }
        else if(Math.floor(daysToX/7)>1){
            temp.push(Math.floor(daysToX/7)+' weeks')
        }
        if(daysToX%7==1){
            temp.push('a day')
        }
        else if(daysToX%7>1){
            temp.push(daysToX%7+' days')
        }
        temp.reverse()
        while(temp.length>0){
            if(temp.length>2){
                response+=temp.pop()+", "
            }
            else if(temp.length==2){
                response+=temp.pop()+" and "
            }
            else{
                response+=temp.pop()
            }
        }
        if(response.length=""){
            response="0 days"
        }
    }
    else if(expressIn=='ymw'){
        if(yearsToX==1){
            temp.push('a year')
        }
        else if(yearsToX>1){
            temp.push(yearsToX+' years')
        }
        if(monthsToX==1){
            temp.push('a month')
        }
        else if(monthsToX>1){
            temp.push(monthsToX+' months')
        }
        timeNow=timeNow.month(timeNow.month()+monthsToX)
        daysToX=targetDate.diff(timeNow,'days')
        if(Math.floor(daysToX/7)==1){
            temp.push('a week')
        }
        else if(Math.floor(daysToX/7)>1){
            temp.push(Math.floor(daysToX/7)+' weeks')
        }
        temp.reverse()
        while(temp.length>0){
            if(temp.length>2){
                response+=temp.pop()+", "
            }
            else if(temp.length==2){
                response+=temp.pop()+" and "
            }
            else{
                response+=temp.pop()
            }
        }
        if(response.length=""){
            response="0 weeks"
        }
    }
    else if(expressIn=='ymwd'){
        if(yearsToX==1){
            temp.push('a year')
        }
        else if(yearsToX>1){
            temp.push(yearsToX+' years')
        }
        if(monthsToX==1){
            temp.push('a month')
        }
        else if(monthsToX>1){
            temp.push(monthsToX+' months')
        }
        timeNow=timeNow.month(timeNow.month()+monthsToX)
        daysToX=targetDate.diff(timeNow,'days')
        if(Math.floor(daysToX/7)==1){
            temp.push('a week')
        }
        else if(Math.floor(daysToX/7)>1){
            temp.push(Math.floor(daysToX/7)+' weeks')
        }
        if(daysToX%7==1){
            temp.push('a day')
        }
        else if(daysToX%7>1){
            temp.push(daysToX%7+' days')
        }
        temp.reverse()
        while(temp.length>0){
            if(temp.length>2){
                response+=temp.pop()+", "
            }
            else if(temp.length==2){
                response+=temp.pop()+" and "
            }
            else{
                response+=temp.pop()
            }
        }
        if(response.length=""){
            response="0 days"
        }
    }
    else{
        if(yearsToX==1){
            temp.push('a year')
        }
        else if(yearsToX>1){
            temp.push(yearsToX+' years')
        }
        if(monthsToX==1){
            temp.push('a month')
        }
        else if(monthsToX>1){
            temp.push(monthsToX+' months')
        }
        timeNow=timeNow.month(timeNow.month()+monthsToX)
        daysToX=targetDate.diff(timeNow,'days')
        if(daysToX==1){
            temp.push('a day')
        }
        else if(daysToX>1){
            temp.push(daysToX+' days')
        }
        temp.reverse()
        while(temp.length>0){
            if(temp.length>2){
                response+=temp.pop()+", "
            }
            else if(temp.length==2){
                response+=temp.pop()+" and "
            }
            else{
                response+=temp.pop()
            }
        }
        if(response.length=""){
            response="0 days"
        }
    }
    if(isPast==true){
        response+=" ago"
    }
    if(upperCase==true){
        response=response.toUpperCase()
    }
    return response
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
                    if(sliced.replace(/\n/g, "").split(" ").join("").slice(1,3).toLowerCase()=="to" || sliced.replace(/\n/g, "").split(" ").join("").slice(1,5).toLowerCase()=="from"){
                        // function_ = sliced.replace(/</g,"").replace(/>/g,"").split(" ")
                        // console.log(function_)
                        tekst = tekst.replace(sliced, functionTo(sliced))
                        i++
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
//97/122

////years months weeks days to| years months   <f get y,m,w,d to/from 2021 August 31>