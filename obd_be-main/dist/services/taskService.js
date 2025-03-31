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
exports.getAllTasks = void 0;
// src/services/tasks.service.ts
const db_1 = __importDefault(require("../db/db"));
const tasks_queries_1 = require("../queries/tasks.queries");
const getAllTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(tasks_queries_1.GET_ALL_TASKS);
    // // Debugging
    // console.log(result.rows);
    return result.rows;
});
exports.getAllTasks = getAllTasks;