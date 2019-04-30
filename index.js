const fs = require('fs');
const compiler = require('./Compiler.js');

const file = "./code/code.c";


// 删除注释
let rmc = (file)=>{
    return new Promise((resolve, reject)=>{
        let newFile = null; // 返回新文件名字

        // 同步读取文件
        let data = fs.readFileSync(file);

        // 删除注释
        const datas = compiler.rmComment(data);

        // 新文件命名规则
        let tmp = file.split(".");
        let n = tmp.pop();
        newFile = `${tmp.join(".")}.temp.${n}`;
        
        // 写入新文件
        fs.writeFile(newFile, datas.filterData , function (err) {
            if (err) {
                return console.error(err);
            }

            // console.log(`\n${file}:`);
            // console.log(`\t=> ${datas.detailed.nLC} LC, ${datas.detailed.nBC} BC.  `)
            // console.log(`\t=> remove comment Successful.`)
            // console.log(`\t=> input =====> ${newFile}\n`);

            resolve(newFile);
        });
    })
}

// 同步读取文件, 这里中间不能有别的代码
let lexer = (newFile)=>{
    return new Promise((resolve, reject)=>{
        // 读取数据
        let data = fs.readFileSync(newFile);

        // 词法化
        compiler.lexer(data.toString());
    })
}

// rmc(file)
//     .then(lexer)

lexer("./code/code.temp.c");




