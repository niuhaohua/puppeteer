var jietu  = require('./monthMail')
jietu.jietu()
setInterval(() => {
    var now = new Date()
    var day = now.getDay()
    var hours = now.getHours()
    var date = now.getDate();
    if(date == 1 && hours == 7){
        jietu.jietu()
    }else{
        console.log("今天"+date+'号')
    }
},3600000)
 
