"use strict";

const secretKey = process.env.SECRET_KEY; // 원하는 시크릿 키

const accessOption = {
        algorithm : process.env.ALGORITHM, // 해싱 알고리즘
        expiresIn : "1 days",  // 토큰 유효 기간 30m
        issuer : process.env.ISSUSER, // 발행자
    }

const refershOption = {
        algorithm : process.env.ALGORITHM, // 해싱 알고리즘
        expiresIn : "31 days",  // 토큰 유효 기간
        issuer : process.env.ISSUSER, // 발행자
    }
module.exports = {
    secretKey,
    accessOption,
    refershOption,
}