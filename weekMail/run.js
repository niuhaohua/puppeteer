var jietu  = require('./index')
jietu.jietu()
setInterval(() => {
    var now = new Date()
    var day = now.getDay()
    var hours = now.getHours()
    if(day == 1 && hours == 7){
        console.log(day+hours+'截图了')
        jietu.jietu()
    }else{
        console.log("今天周"+day)
    }
},3600000)
 
