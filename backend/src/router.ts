/* eslint-disable @typescript-eslint/no-redeclare */
import z from 'zod';
import * as trpcExpress from '@trpc/server/adapters/express';
import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';

let cats: Cat[] = [];

const Cat = z.object({
  id: z.number(),
  name: z.string(),
});

const Cats = z.array(Cat);

function newId(): number {
  return Math.floor(Math.random() * 10000)
}

// created for each request
export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

const trpcRouter = t.router({
  create: t.procedure
    .input(
      z.object({ name: z.string().max(50) }),
    )
    .mutation((opts) => {
      const { input } = opts;
      const newCat: Cat = { id: newId(), name: input.name };
      cats.push(newCat)
      return newCat
    }),
  get: t.procedure.input(z.number()).output(Cat).query((opts) => {
    const { input } = opts;
    const foundCat = cats.find((cat => cat.id === input));
    if (!foundCat) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `could not find cat with id ${input}`,
      });
    }
    return foundCat;
  }),
  list: t.procedure.output(Cats).query(() => {
    return cats;
  }),
  delete: t.procedure.output(z.string()).input(z.object({ id: z.number() })).mutation((opts) => {
    const { input } = opts;

    cats = cats.filter(cat => cat.id !== input.id);
    return "success"
  })
})

export type Cat = z.infer<typeof Cat>;
export type Cats = z.infer<typeof Cats>;

export type TRPCRouter = typeof trpcRouter;
export default trpcRouter;