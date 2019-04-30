// 删除注释
const rmComment = (datas) => {
    const data = datas.toString().split("");

    // 返回的数据
    let ret = { 
        filterData : "",    // 过滤后的数据
        detailed:{}         // 详细信息，行注释，块注释数量      
    }    
    
    // 引号 行注释 块注释 行注释数量 块注释数量 过滤数据
    let [q, isLC, isBC, nLC, nBC, filterData] = [false, false, false, 0, 0, ""];

    for (let i = 0; i < data.length; i++) {
        // 前中后字符
        const [cf, c, cn] = [data[i - 1], data[i], data[i + 1]];

        // 字符串过滤
        if (!(isBC || isBC) && c == `"`)
            q = !q ? true : cf + c == `\\"` ? q : false;

        // 注释过滤
        if (!q) {
            // 行注释
            if (!isLC && !isBC && c + cn == "//"){      // 行注释嵌套行注释跳过
                isLC = true;
                nLC++
            }
            if (isLC && c + cn == "\r\n" && cf + c + cn != "\\\r\n")
                isLC = false;

            // 块注释
            if (!isLC && c + cn == "/*") {
                isBC = true;
                nBC++
            }
            if (isBC && cf + c == "*/") {
                isBC = false;
                continue;       // 不传入本次的 / 符号
            }
        }

        if (!(isLC || isBC))
            filterData += c;
    }

    ret.filterData = filterData;
    ret.detailed = { nLC,nBC  }
    return ret;
}

// 词法分析器
const lexer = stream => {
    let data = stream.toString().replace(/[\r\n]/g, "");    // 去换行回车
    let chars = data.split("");         // 切割成字符

    let str = "";
    let arr = [];
    for (let i = 0; i < chars.length; i++) {
        let [c, cn] = [chars[i], chars[i+1]];
        
        // 基本保留字、标识符、常数、运算符、界符
        // 标示符，基本保留字
        let patt = /[0-9a-zA-Z]/;
        if (patt.test(c)){
            let tmp = "";
            while (patt.test(c)) {
                tmp += c;
                c = chars[++i];
            }
            i--;
            arr.push(tmp);
            continue;
        }

        // 常数


        // 运算符，界定符
        if(c==" "){
            while (c == " ") {
                c = chars[++i];
            }
            i--;
        }
        
        
        str += chars[i];
        
        

    }
    console.log(arr);
    console.log(str);
}


module.exports = {
    rmComment : rmComment,
    lexer : lexer,
}




