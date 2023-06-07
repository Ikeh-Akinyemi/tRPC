
import { useState } from 'react';
import './App.css';
<<<<<<< Updated upstream:client/src/App.tsx
import type { TRPCRouter } from '../../src/router';
import { createTRPCReact } from '@trpc/react';
import { QueryClient, QueryClientProvider } from 'react-query';
=======
import { httpBatchLink } from '@trpc/client';
import type { TRPCRouter } from '../../backend/src/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
>>>>>>> Stashed changes:frontend/src/App.tsx
import Create from './cats/Create';
import Detail from './cats/Detail';
import List from './cats/List';

const BACKEND_URL: string = "http://localhost:8080/cat";

export const trpc = createTRPCReact<TRPCRouter>();

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient({ url: BACKEND_URL }));

  const [detailId, setDetailId] = useState(-1);

  const setDetail = (id: number) => {
    setDetailId(id);
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Create />
          <List setDetail={setDetail}/>
          { detailId > 0 ? <Detail id={detailId} /> : null }
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;