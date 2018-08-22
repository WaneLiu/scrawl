const superagent = require('superagent')

let baseUrl = 'http://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=461&p='
let views = []
let hrefs = []
let titles = []
let replyNums = []
function getCurrentPageList(p) {
    superagent.get(baseUrl + p).end((err, res) => {
        res = res.text
        //views
        res.replace(/<i class="iconView"><\/i>(\w+)<\/span>/g, function(match, $1) {
            views.push($1)
        })
        console.log(views.length)
        //hrefs
        res.replace(/<a href="([^"]*)" title=/g, function(match, $1) {
            hrefs.push($1)
        })
        hrefs.pop()
        console.log(hrefs.length)
        //replyNum
        res.replace(/<i class="iconReply"><\/i>(\d+)<\/span>/g, (match, $1) => {
            replyNums.push($1)
        })
        console.log(replyNums.length)
        //title
        res.replace(/title="([^"]*)" target=/g, (match, $1) => {
            titles.push($1)
        })
        titles.pop()
        console.log(titles.length)
    })
}

getCurrentPageList(1)