"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeById = exports.deleteEmployee = exports.updateEmployee = exports.createEmployee = exports.getOnboardingEmployees = exports.getEmployees = void 0;
const employeeService = __importStar(require("../services/employeesService"));
const getEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employeeService.getAllEmployees();
        // // Debugging
        // console.log(employees);
        res.json(employees);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});
exports.getEmployees = getEmployees;
const getOnboardingEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employeeService.getOnboardingEmployees();
        res.json(employees);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch onboarding employees' });
    }
});
exports.getOnboardingEmployees = getOnboardingEmployees;
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // // Debugging
        // console.log(req.body);
        const employee = yield employeeService.createEmployee(req.body);
        res.status(201).json(employee);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create employee' });
    }
});
exports.createEmployee = createEmployee;
const updateEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // // Debugging
    console.log(req.body);
    console.log(req.params.id);
    try {
        const updated = yield employeeService.updateEmployee(Number(req.params.id), req.body);
        res.json(updated);
    }
    catch (err) {
        // // Debugging
        console.log(err);
        res.status(500).json({ error: 'Failed to update employee' });
    }
});
exports.updateEmployee = updateEmployee;
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield employeeService.deleteEmployee(Number(req.params.id));
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});
exports.deleteEmployee = deleteEmployee;
const getEmployeeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield employeeService.getEmployeeById(Number(req.params.id));
        // // Debugging
        console.log(employee);
        res.status(200).json(employee);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});
exports.getEmployeeById = getEmployeeById;
