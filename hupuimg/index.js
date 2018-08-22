const superagent = require('superagent')
const url = 'https://bbs.hupu.com/17113738.html'
const html = superagent.get(url, (err, res) => {
    res = res.text
    console.log(res)
    let imgUrls =[]
    const regex = /<img\s+src="([^"]*)">/g
    res.replace(regex, function(match, $1) {
        imgUrls.push($1)
    })
    console.log(imgUrls)
})