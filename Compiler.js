// 删除注释
const rmComment = (input) => {
    const data = input.toString().split("");

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
// 基本保留字1、标识符2、常数(字符串)3、运算符4、界符5
const lexer = stream => {
    let data = stream.toString().replace(/[\r\n]/g, "");    // 去换行回车
    let chars = data.split("");         // 切割成字符

    // 保留字字典1
    let key = ["auto","break","case","char","const","continue","default","do","double","else","enum","extern","float","for","goto","if","int","long","redister","return","short","signed","sizeof","static","struct","switch","typedef","union","unsigned","void","volatile","while","include"];      
    // 运算符字典4
    let operator = ["+","-","*","/","%","="];  
    // 界符字典5
    let doundary = ["{", "}", ";", "\"", "\'", ",", "(", ")", "<", ">","[","]"];

    // 映射
    let vk = {
        key: 1,
        identifier:  2,
        constant: 3,
        operator: 4,
        doundary: 5,
    }
    
    // 返回
    let output = [];

    // 处理
    // 数组化
    let arr = [];
    for (let i = 0; i < chars.length; i++) {
        let [cf, c, cn] = [chars[i-1], chars[i], chars[i+1]];
        
        // 基本保留字，标示符，常数
        let patt = /[0-9a-zA-Z]/;
        if (patt.test(c)){
            let tmp = "";

            if(cf=="\""){
                while(!(c=="\"" && chars[i-1]!="\\")){
                    tmp += c;
                    c = chars[++i];
                }
            }else if(cf=="'"){
                while (c != "'") {
                    tmp += c;
                    c = chars[++i];
                }
            }
            else while (patt.test(c)) {
                tmp += c;
                c = chars[++i];
            }
            i--;
            arr.push(tmp);
            continue;
        }

        // 运算符，界定符
        if(c==" "){
            while (c == " ") 
                c = chars[++i];
            i--;
            continue;
        }
        
        arr.push(chars[i])

    }
    // console.log(arr)
    // 分类
    // 保存形式 { type:' ', value:' '}
    for (let i = 0; i < arr.length; i++) {
        let type = undefined;
        const [cf, c] = [arr[i-1], arr[i]];
        if (key.find(x => c == x)) type = vk.key;   // 关键字
        else if (operator.find(x => c == x)) type = vk.operator;      // 运算符
        else if (doundary.find(x => c == x)) type = vk.doundary;      // 边界符
        else if (/["']/.test(cf)) type = vk.constant;                 // 字符串
        else if (/^[0-9]+.?[0-9]*$/.test(c)) type = vk.constant;
        else type = vk.identifier;

        output.push({
            type: type,
            value: c
        })
    }
    console.log(output)

    return output;

}


module.exports = {
    rmComment : rmComment,
    lexer : lexer,
}




