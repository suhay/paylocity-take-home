import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router'

import { Company } from './Company'
import { Details } from './Employees/Details'

import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='max-w-7xl mx-auto p-8 text-center relative z-10'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Company companyId={1} />} />
            <Route path=':companyId/:employeeId' element={<Details />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  )
}

export default App
