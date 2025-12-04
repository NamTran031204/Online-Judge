import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layout/layout"

function App() {
  // const [count, setCount] = useState(0)

  return (
     <BrowserRouter>
      <Routes>

        {/* Layout chung */}
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="contests" element={<Contests />} />
          <Route path="problems" element={<Problems />} />
          <Route path="submissions" element={<Submissions />} />
          <Route path="classes" element={<Classes />} />
          <Route path="settings" element={<Settings />} /> */}
                  <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Route>

        {/* 404 */}

      </Routes>
    </BrowserRouter>
  )
}

export default App
