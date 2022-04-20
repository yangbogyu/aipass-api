const logger = require("../../../winton");

// 특수문자 체크
function checkSpecial(str) {
    const regExp = /[\-\_\=\+\(\)\[\]\{\}`~!@#$%^&*|\\\'\";:\/?]/gi;
    if(regExp.test(str)) {
        return true;
    }else{
        return false;
    }
}

// 한글 체크
function checkKor(str) {
    const regExp = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;
    if(regExp.test(str)){
        return true;
    }else{
        return false;
    }
}
// 숫자 체크
function checkNum(str){
    const regExp = /[0-9]/g;
    if(regExp.test(str)){
        return true;
    }else{
        return false;
    }
}
// 영문(영어) 체크
function checkEng(str){
    const regExp = /[a-zA-Z]/g;
    // 영어
    if(regExp.test(str)){
        return true;
    }else{
        return false;
    }
}
// 영문+숫자만 입력 체크
function checkEngNum(str) {
    const regExp1 = /[a-zA-Z0-9]/;
    const regExp2 = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;

    if(regExp1.test(str) && !regExp2.test(str) && !checkSpecial(str)){
        return false;
    }else{
        return true;
    }
}
// 공백(스페이스 바)체크
function checkSpace(str) {
    if(str.search(/\s/) !== -1) {
        return true; // 스페이스가 있는 경우
    }else{
        return false; // 스페이스 없는 경우
    }
}

module.exports = {
    checkSpecial,
    checkSpace,
    checkEngNum,
    checkEng,
    checkNum,
    checkKor
};