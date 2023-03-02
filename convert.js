const mysql = require('mysql')
let pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'chinese_poetry',
    connectionLimit: 100, ////连接池最多可以创建的连接数
    queueLimit: 0 // 队伍中等待连接的最大数量，0为不限制。
})
const queryAsync = function (sql, params) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                 reject(err)
            } else {
                connection.query(sql, params, (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                    connection.release();
                })
            }
        })
    }).catch(err => {
        console.log('queryAsync出错 => ' + err)
    })
}
const num = {
    tangPoetry: 58,
    songPoetry: 255,
    songCi: 22,
    huajianji: 11
}
const convertPoetry = async dynasty => {
    queryAsync(`truncate table ${dynasty}_poetry`)
    let sql = `insert into ${dynasty}_poetry(author,title,tags,content,poem_id) value(?,?,?,?,?)`
    for (let i = 0; i < num[dynasty+'Poetry']; i++) {
        let poetry = require(`chinese-poetry/chinese-poetry/json/poet.${dynasty}.${i*1000}.json`)
        if (i && i%100 === 0) await new Promise(resolve => setTimeout(() => resolve(), 1000))
        for await(const [index, item] of poetry.entries()) {
            const { author, title, id } = item
            tags = item.tags?.join('|')
            content = item.paragraphs.join('|')
            let resInsert = await queryAsync(sql, [author,title,tags,content,id])
            if (resInsert.affectedRows !== 0) {
                console.log(`poet.${dynasty}.${i*1000}.json--添加--第${index+1}首`)
            } else {
                console.log(`poet.${dynasty}.${i*1000}.json--添加失败--第${index+1}首`)
            }
        }
    }
}
const convertCi = async () => {
    queryAsync(`truncate table song_ci`)
    let sql = `insert into song_ci(author,rhythmic,tags,content) value(?,?,?,?)`
    for (let i = 0; i < num['songCi']; i++) {
        let poetry = require(`chinese-poetry/chinese-poetry/ci/ci.song.${i*1000}.json`)
        for await(const [index, item] of poetry.entries()) {
            const { author, rhythmic } = item
            tags = item.tags?.join('|')
            content = item.paragraphs.join('|')
            let resInsert = await queryAsync(sql, [author,rhythmic,tags,content])
            if (resInsert.affectedRows !== 0) {
                console.log(`ci.song.${i*1000}.json--添加--第${index+1}首`)
            } else {
                console.log(`ci.song.${i*1000}.json--添加失败--第${index+1}首`)
            }
        }
    }
}
const convertLunyu = async () => {
    queryAsync(`truncate table lunyu`)
    let sql = `insert into lunyu(chapter,content) value(?,?)`
    let poetry = require(`chinese-poetry/chinese-poetry/lunyu/lunyu.json`)
    for await(const [index, item] of poetry.entries()) {
        const { chapter } = item
        content = item.paragraphs.join('|')
        let resInsert = await queryAsync(sql, [chapter,content])
        if (resInsert.affectedRows !== 0) {
            console.log(`lunyu.json--添加--第${index+1}篇`)
        } else {
            console.log(`lunyu.json--添加失败--第${index+1}篇`)
        }
    }
}
const convertCaocaoshiji = async () => {
    queryAsync(`truncate table caocaoshiji`)
    let sql = `insert into caocaoshiji(title,content) value(?,?)`
    let poetry = require(`chinese-poetry/chinese-poetry/caocaoshiji/caocao.json`)
    for await(const [index, item] of poetry.entries()) {
        const { title } = item
        content = item.paragraphs.join('|')
        let resInsert = await queryAsync(sql, [title,content])
        if (resInsert.affectedRows !== 0) {
            console.log(`caocao.json--添加--第${index+1}篇`)
        } else {
            console.log(`caocao.json--添加失败--第${index+1}篇`)
        }
    }
}
const convertShijing = async () => {
    queryAsync(`truncate table shijing`)
    let sql = `insert into shijing(title,chapter,section,content) value(?,?,?,?)`
    let poetry = require(`chinese-poetry/chinese-poetry/shijing/shijing.json`)
    for await(const [index, item] of poetry.entries()) {
        const { title, chapter, section } = item
        content = item.content.join('|')
        let resInsert = await queryAsync(sql, [title,chapter,section,content])
        if (resInsert.affectedRows !== 0) {
            console.log(`shijing.json--添加--第${index+1}篇`)
        } else {
            console.log(`shijing.json--添加失败--第${index+1}篇`)
        }
    }
}
const convertHuajianji = async () => {
    queryAsync(`truncate table huajianji`)
    let sql = `insert into huajianji(title,author,rhythmic,content,notes) value(?,?,?,?,?)`
    for (let i = 1; i < num['huajianji']; i++) {
        if (i === 10) i = 'x'
        let poetry = require(`chinese-poetry/chinese-poetry/wudai/huajianji/huajianji-${i}-juan.json`)
        for await(const [index, item] of poetry.entries()) {
            const { title, author, rhythmic } = item
            notes = item.notes.join('|')
            content = item.paragraphs.join('|')
            let resInsert = await queryAsync(sql, [title,author,rhythmic,content,notes])
            if (resInsert.affectedRows !== 0) {
                console.log(`huajianji-${i}-juan.json--添加--第${index+1}首`)
            } else {
                console.log(`huajianji-${i}-juan.json--添加失败--第${index+1}首`)
            }
        }
    }
}
const convertNantang = async () => {
    queryAsync(`truncate table nantang`)
    let sql = `insert into nantang(title,author,rhythmic,content,notes) value(?,?,?,?,?)`
    let poetry = require(`chinese-poetry/chinese-poetry/wudai/nantang/poetrys.json`)
    for await(const [index, item] of poetry.entries()) {
        const { title, author, rhythmic } = item
        notes = item.notes.join('|')
        content = item.paragraphs.join('|')
        let resInsert = await queryAsync(sql, [title,author,rhythmic,content,notes])
        if (resInsert.affectedRows !== 0) {
            console.log(`nantang/poetrys.json--添加--第${index+1}首`)
        } else {
            console.log(`nantang/poetrys.json--添加失败--第${index+1}首`)
        }
    }
}

const convertPoetryAuthor = async dynasty => {
    queryAsync(`truncate table ${dynasty}_poetry_author`)
    let sql = `insert into ${dynasty}_poetry_author(name,description,author_id) value(?,?,?)`
    let authors = require(`chinese-poetry/chinese-poetry/json/authors.${dynasty}.json`)
    for await(const [index, item] of authors.entries()) {
        const { name, id } = item
        description = item.desc?.split(' ').join('')
        let resInsert = await queryAsync(sql, [name,description,id])
        if (resInsert.affectedRows !== 0) {
            console.log(`authors.${dynasty}.json--添加--第${index+1}个`)
        } else {
            console.log(`authors.${dynasty}.json--添加失败--第${index+1}个`)
        }
    }
}
const convertCiAuthor = async () => {
    queryAsync(`truncate table song_ci_author`)
    let sql = `insert into song_ci_author(name,short_description,description) value(?,?,?)`
    let authors = require(`chinese-poetry/chinese-poetry/ci/author.song.json`)
    for await(const [index, item] of authors.entries()) {
        const { name, short_description } = item
        description = item.description.split(' ').join('').split("--").join('')
        let resInsert = await queryAsync(sql, [name,short_description,description])
        if (resInsert.affectedRows !== 0) {
            console.log(`author.song.json--添加--第${index+1}个`)
        } else {
            console.log(`author.song.json--添加失败--第${index+1}个`)
        }
    }
}
const convertAllAuthor = async () => {
    queryAsync(`truncate table poet`)
    let sql = `insert into poet(name,description) value(?,?)`
    let allAuthors = [
        require(`chinese-poetry/chinese-poetry/json/authors.tang.json`),
        require(`chinese-poetry/chinese-poetry/json/authors.song.json`),
        require(`chinese-poetry/chinese-poetry/wudai/nantang/authors.json`),
        require(`chinese-poetry/chinese-poetry/ci/author.song.json`)
    ]
    let filename = ['authors.tang.json','authors.song.json','nantang/authors.json','author.song.json']
    for await(const [i, authors] of allAuthors.entries()) {
        for await(const [index, item] of authors.entries()) {
            const { name } = item
            description = i !== 3 ? item.desc?.split(' ').join('') : item.description.split(' ').join('').split("--").join('')
            let resInsert = await queryAsync(sql, [name,description])
            if (resInsert.affectedRows !== 0) {
                console.log(`${filename[i]}--添加--第${index+1}个`)
            } else {
                console.log(`${filename[i]}--添加失败--第${index+1}个`)
            }
        }
    }
    
}

const convertPoetryPopularity = async dynasty => {
    queryAsync(`truncate table ${dynasty}_poetry_popularity`)
    let sql = `insert into ${dynasty}_poetry_popularity(author,title,baidu,google,so360,bing,bing_en) value(?,?,?,?,?,?,?)`
    for (let i = 0; i < num[dynasty+'Poetry']; i++) {
        if (i && i%100 === 0) await new Promise(resolve => setTimeout(() => resolve(), 500))
        let data = require(`chinese-poetry/chinese-poetry/rank/poet/poet.${dynasty}.rank.${i*1000}.json`)
        for await(const [index, item] of data.entries()) {
            const { author, title, baidu, google, so360, bing, bing_en } = item
            let resInsert = await queryAsync(sql, [author,title,baidu,google,so360,bing,bing_en])
            if (resInsert.affectedRows !== 0) {
                console.log(`poet.${dynasty}.rank.${i*1000}.json--添加--第${index+1}首`)
            } else {
                console.log(`poet.${dynasty}.rank.${i*1000}.json--添加失败--第${index+1}首`)
            }
        }
    }
}
const convertCiPopularity = async () => {
    queryAsync(`truncate table song_ci_popularity`)
    let sql = `insert into song_ci_popularity(author,rhythmic,baidu,google,so360,bing,bing_en) value(?,?,?,?,?,?,?)`
    for (let i = 0; i < num['songCi']; i++) {
        let data = require(`chinese-poetry/chinese-poetry/rank/ci/ci.song.rank.${i*1000}.json`)
        for await(const [index, item] of data.entries()) {
            const { author, rhythmic, baidu, google, so360, bing, bing_en } = item
            let resInsert = await queryAsync(sql, [author,rhythmic,baidu,google,so360,bing,bing_en])
            if (resInsert.affectedRows !== 0) {
                console.log(`ci.song.rank.${i*1000}.json--添加--第${index+1}首`)
            } else {
                console.log(`ci.song.rank.${i*1000}.json--添加失败--第${index+1}首`)
            }
        }
    }
}

const main = async () => {
    // await convertPoetry('tang')
    // await convertPoetry('song')
    // await convertCi()
    // await convertLunyu()
    // await convertCaocaoshiji()
    // await convertShijing()
    // await convertHuajianji()
    // await convertNantang()

    // 统一放入poet表
    // await convertAllAuthor()

    // 分开建表
    // await convertPoetryAuthor('tang')
    // await convertPoetryAuthor('song')
    // await convertCiAuthor()
    
    // 诗词知名度
    // await convertPoetryPopularity('tang')
    // await convertPoetryPopularity('song')
    // await convertCiPopularity()
}
main()