const express = require('express');
const ctrl = require('./user.ctrl');
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: users
 *  description: 기본 회원관련 API
 * definitions:
 *  register:
 *    type: "object"
 *    properties:
 *      user_mobile:
 *        type: "string"
 *      user_psword:
 *        type: "string"
 *      user_code:
 *        type: "string"
 *      birth:
 *        type: "string"
 *      gender_code:
 *        type: "string"
 *      user_name:
 *        type: "string"
 *      advertise_agree:
 *        type: "string"
 *        format: "Y"
 *      push_agree:
 *        type: "string"
 *      information_agree:
 *        type: "string"
 */


/**
 * @swagger
 * paths:
 *  /user/register:
 *    post:
 *      tags: [users]
 *      summary: 회원가입
 *      description: ""
 *      operationId: "registerInfo"
 *      consumes:
 *      - "application/json"
 *      produces:
 *      - "application/json" 
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Pet object that needs to be added to the store"
 *        required: true
 *        schema:
 *          $ref: "#/definitions/register"
 *      responses:
 *        "405":
 *          description: "Invalid input"
 *      security:
 *      - petstore_auth:
 *        - "write:pets"
 *        - "read:pets"
 */
router.post('/register', ctrl.process.register);

module.exports = router;
