const puppeteer = require('puppeteer');
const fs = require("fs")

const account = `admin1`;
const password = `asdfijn`;

function jietu() {
    (async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('打开页面')
        const page = await browser.newPage();
        console.log('前往页面')
        await page.goto('http://192.168.60.122:8081/login');
        console.log('等待5秒')
        await page.waitFor(5000);
        console.log('输入账号')
        await page.waitFor(5000);
        await page.type('#account', account);
        console.log('输入密码')
        await page.waitFor(5000);
        await page.type('#password', password);
        console.log('点击登陆')
        await page.click('#logindms');
        await page.waitForNavigation({
            waitUntil: 'load'
        })
        const page1 = await browser.newPage();
        console.log('前往产品查询统计页面')
        await page1.goto('http://192.168.60.122:8081/authc/productQueryCount/index');
        await page1.setViewport({
            width: 1920,
            height: 4000
        });
        console.log('再等待30秒')
        await page1.waitFor(30000);
        let startDate = getlastmonth().firstday
        let endDate = getlastmonth().lastday
        await page1.$eval('#startDate',input => input.value='' );
        await page1.$eval('#endDate',input => input.value='' );
        
        await page1.type('#startDate',startDate)
        await page1.type('#endDate',endDate)
        console.log(startDate,endDate)
        await page1.click('#time_search')
        console.log('再等待30秒')
        await page1.waitFor(30000);

        //创建文件夹，以当天时间为文件夹名字
        console.log('创建文件夹')
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var day = now.getDay();
        await month < 10 ? month = '0' + month : month
        await date < 10 ? date = '0' + date : date
        fileName = year + '' + month + '' + date
        await fs.mkdir('./mail_picture/' + fileName, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log("目录创建成功。");
        });


        //产品查询量变化图(pic1)
        await page1.screenshot({
            path: './mail_picture/' + fileName + '/pic' + 1 + '.png',
            clip: {
                x: 520,
                y: 350,
                width: 1070,
                height: 400
            }
        });
        console.log('截图pic' + 1 + '完毕')


        //不同响应时间查询量占比(pic4)
        await page1.screenshot({
            path: './mail_picture/' + fileName + '/pic' + 4 + '.png',
            clip: {
                x: 520,
                y: 1181,
                width: 430,
                height: 400
            }
        });
        console.log('截图pic' + 4 + '完毕')


        /**
         * 开始截取排行榜前十机构的客户查询量趋势图
         */
        console.log('打开客户消费统计专门用于截取排行榜前十的页面')
        const page3 = await browser.newPage();
        await page3.goto('http://192.168.60.122:8081/authc/monthMail/index');
        await page3.setViewport({
            width: 1920,
            height: 7000
        });
        console.log('再等待30秒')
        await page3.waitFor(30000);
        let height = 65
        for (let key = 1; key <= 10; key++) {
            await page3.waitFor(5000)
            height = 65 + 350 * (key - 1)
            await page3.screenshot({
                path: './mail_picture/' + fileName + '/topTenInst' + key + '.png',
                clip: {
                    x: 520,
                    y: height,
                    width: 1070,
                    height: 350
                }
            });
        }


        //各部门收入完成情况(pic2)
        await page3.screenshot({
            path: './mail_picture/' + fileName + '/pic' + 2 + '.png',
            clip: {
                x: 520,
                y: (height + 750),
                width: 1070,
                height: 350
            }
        });
        console.log('截图pic' + 2 + '完毕')

        //各产品组查询量占比(pic3)
        await page3.screenshot({
            path: './mail_picture/' + fileName + '/pic' + 3 + '.png',
            clip: {
                x: 520,
                y: (height + 1600),
                width: 600,
                height: 350
            }
        });
        console.log('截图pic' + 3 + '完毕')


        //各类型客户查询金额排序（pic5）
        await page3.screenshot({
            path: './mail_picture/' + fileName + '/pic' + 5 + '.png',
            clip: {
                x: 520,
                y: (height + 1100),
                width: 1070,
                height: 500
            }
        });
        console.log('截图pic' + 5 + '完毕')



        //客户查询量排行榜(pic4) 客户查询量排行榜也去除中诚信的数据，所以和十个公司用一个接口，放在新页面
        await page3.screenshot({
            path: './mail_picture/' + fileName + '/pic' + 6 + '.png',
            clip: {
                x: 520,
                y: (height + 350),
                width: 500,
                height: 400
            }
        });
        console.log('截图pic' + 6 + '完毕')


        // 关闭浏览器
        await browser.close()
    })()
}

function getlastmonth() {
    var lastMdata = {};
    var curTime = new Date();
    var curYear = curTime.getFullYear();
    var curMonth = curTime.getMonth();
    console.log("当前时间:" + curTime.getFullYear() + "-" + (curTime.getMonth() + 1) + "-" + curTime.getDate());
    var curMonthFirstDay = new Date(curYear, curMonth, 1);
    var beforeMonth = curMonth - 1;
    if (beforeMonth == -1) {
        curYear = curYear - 1;
        beforeMonth = 11;

    }

    //上个月的第一天
    var beforeStartDate = new Date(curYear, beforeMonth, 1);
    let  beforeStartMonth = beforeStartDate.getMonth() + 1
    let  beforeStartDay = beforeStartDate.getDate()
    if(beforeStartMonth < 10){
        beforeStartMonth = '0'+ beforeStartMonth
    }
    if(beforeStartDay < 10){
        beforeStartDay = '0'+ beforeStartDay
    }
    lastMdata.firstday = beforeStartDate.getFullYear() + "-" + beforeStartMonth + "-" +
    beforeStartDay

    //上个月的最后一天
    var beforeMonthLastDay = new Date(curMonthFirstDay.getTime() - (24 * 3600 * 1000));
    let beforeMonth1 = beforeMonthLastDay.getMonth() + 1
    let beforeDay = beforeMonthLastDay.getDate()
    if(beforeMonth1 < 10){
        beforeMonth1 = '0'+ beforeMonth1
    }
    if(beforeDay < 10){
        beforeDay = '0'+ beforeDay
    }
    lastMdata.lastday = beforeMonthLastDay.getFullYear() + "-" + beforeMonth1+ "-" +
    beforeDay

    //				最后获取的时间
    console.log(lastMdata);
    return lastMdata
}


exports.jietu = jietu