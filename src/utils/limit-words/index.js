export const UseLimitWords = (str, limit) => {
    let arrStr = str.split(" ");
    let tmpStr = "";

    for(let i = 0; i < limit; i++){
        if(i < arrStr.length){
            tmpStr += arrStr[i] + " ";
        }
    }

    if(arrStr.length > limit){
        tmpStr += " ..."
    }

    return tmpStr;
}