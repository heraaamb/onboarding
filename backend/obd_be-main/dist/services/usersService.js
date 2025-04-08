"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
// src/services/users.service.ts
const db_1 = __importDefault(require("../db/db"));
const users_queries_1 = require("../queries/users.queries");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(users_queries_1.GET_ALL_USERS);
    // // Debugging
    console.log(result.rows);
    return result.rows;
});
exports.getAllUsers = getAllUsers;
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const plainPassword = crypto_1.default.randomBytes(8).toString('hex');
    const saltRounds = 10;
    const password_hash = yield bcrypt_1.default.hash(plainPassword, saltRounds);
    // // Debugging
    // console.log(password_hash);
    const { name, email, role, department_name, status } = data;
    const department_id = yield db_1.default.query(`SELECT dept_id FROM departments where name='$1'`, [department_name]);
    console.log(department_id);
    const result = yield db_1.default.query(users_queries_1.CREATE_USER, [name, email, password_hash, role, department_id, status]);
    return result.rows[0];
});
exports.createUser = createUser;
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password_hash, role, department_id, status } = data;
    const result = yield db_1.default.query(users_queries_1.UPDATE_USER, [name, email, password_hash, role, department_id, status]);
    return result.rows[0];
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.query(users_queries_1.DELETE_USER, [id]);
});
exports.deleteUser = deleteUser;
