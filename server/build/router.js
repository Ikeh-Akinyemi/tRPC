"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
/* eslint-disable @typescript-eslint/no-redeclare */
const zod_1 = __importDefault(require("zod"));
const server_1 = require("@trpc/server");
let cats = [];
const Cat = zod_1.default.object({
    id: zod_1.default.number(),
    name: zod_1.default.string(),
});
const Cats = zod_1.default.array(Cat);
function newId() {
    return Math.floor(Math.random() * 10000);
}
// created for each request
const createContext = ({ req, res, }) => ({}); // no context
exports.createContext = createContext;
const t = server_1.initTRPC.context().create();
const trpcRouter = t.router({
    create: t.procedure
        .input(zod_1.default.object({ name: zod_1.default.string().max(50) }))
        .mutation((opts) => {
        const { input } = opts;
        const newCat = { id: newId(), name: input.name };
        cats.push(newCat);
        return newCat;
    }),
    get: t.procedure.input(zod_1.default.number()).output(Cat).query((opts) => {
        const { input } = opts;
        const foundCat = cats.find((cat => cat.id === input));
        if (!foundCat) {
            throw new server_1.TRPCError({
                code: 'BAD_REQUEST',
                message: `could not find cat with id ${input}`,
            });
        }
        return foundCat;
    }),
    list: t.procedure.output(Cats).query(() => {
        return cats;
    }),
    delete: t.procedure.output(zod_1.default.string()).input(zod_1.default.object({ id: zod_1.default.number() })).mutation((opts) => {
        const { input } = opts;
        cats = cats.filter(cat => cat.id !== input.id);
        return "success";
    })
});
exports.default = trpcRouter;
