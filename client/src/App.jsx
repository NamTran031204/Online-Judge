import { useState } from 'react'
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <RouterRoutes>
      <Route
        path="/dashboard"
        element={
          <Dashboard />
        }
      />
      <Route
        path="/contest"
        element={
          <Contest />
        }
      />
      <Route
        path="/problem"
        element={
          <Problem />
        }
      />
      <Route
        path="/submission"
        element={
          <Submission />
        }
      />
      <Route
        path="/register"
        element={
          <Register />
        }
      />
      <Route
        path="/login"
        element={
          <Login />
        }
      />
      {/* <Route
        path="/profile"
        element={
          <BaseLayout>
            <div>Hello</div>
          </BaseLayout>
        }
      /> */}
      <Route
        path="/admin"
        element={
          <Admin />
        }
      />
      <Route path="*" element={<div>404</div>} />
    </RouterRoutes>
  )
}

export default App
