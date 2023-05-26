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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const trpc = __importStar(require("@trpc/server"));
let cats = [];
const Cat = zod_1.default.object({
    id: zod_1.default.number(),
    name: zod_1.default.string(),
});
const Cats = zod_1.default.array(Cat);
function newId() {
    return Math.floor(Math.random() * 10000);
}
const trpcRouter = trpc.router()
    .query('get', {
    input: zod_1.default.number(),
    output: Cat,
    async resolve(req) {
        const foundCat = cats.find((cat => cat.id === req.input));
        if (!foundCat) {
            throw new trpc.TRPCError({
                code: 'BAD_REQUEST',
                message: `could not find cat with id ${req.input}`,
            });
        }
        return foundCat;
    },
})
    .query('list', {
    output: Cats,
    async resolve() {
        return cats;
    },
})
    .mutation('create', {
    input: zod_1.default.object({ name: zod_1.default.string().max(50) }),
    async resolve(req) {
        const newCat = { id: newId(), name: req.input.name };
        cats.push(newCat);
        return newCat;
    }
})
    .mutation('delete', {
    input: zod_1.default.object({ id: zod_1.default.number() }),
    output: zod_1.default.string(),
    async resolve(req) {
        cats = cats.filter(cat => cat.id !== req.input.id);
        return "success";
    }
});
exports.default = trpcRouter;
