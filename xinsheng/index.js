const superagent = require('superagent')

let baseUrl = 'http://xinsheng.huawei.com/cn/index.php?app=forum&mod=List&act=index&class=461&p='
let views = []
let hrefs = []
let titles = []
let replyNums = []
let totalPage
let promises = []
let posts = []
function Post(href, title, view, reply) {
    this.href = href
    this.title = title
    this.view = view
    this.reply = reply
}
//获得论坛当前一共有多少条post
async function getTotalPage() {
    return new Promise((resolve, reject) => {
        superagent.get(baseUrl + '1').end((err, res) => {
            if (err) {
                console.log(err)
                reject(err)
            }
            res = res.text
            //totalpage
            let regex = /data-url="" \/>\/([\d]*) /
            res.replace(regex, (match, $1) => {
                //totalPage = $1
                resolve($1)
            })
        })
        
    }).catch(
        error => console.log(error + ' get total page error')
    )
}

function getCurrentPageList(p) {
    return new Promise((resolve, reject) => {
        superagent.get(baseUrl + p).end((err, res) => {
            if (err) {
                console.log(err)
                reject(err)
            } 
            res = res.text
            //views
            let href = '',
                title = '',
                view = '',
                reply = ''
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
            for (let i = 0; i < titles.length; ++i) {
                posts.push(new Post(hrefs[i], titles[i], views[i], replyNums[i]))
            }
            resolve(posts)
        })
        
    })
}
//
async function index() {
    totalPage = await getTotalPage()
    console.log(totalPage)
    for (let i = 1; i <= totalPage; ++i) {
        //promises.push(getCurrentPageList(i))
        getCurrentPageList(i)
    }
}

index()

//getCurrentPageList(1)