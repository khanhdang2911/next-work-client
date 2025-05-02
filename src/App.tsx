import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { privateRoutes, publicRoutes } from './routes/routes'
import React, { useEffect } from 'react'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import { injectAuth0Functions } from './config/httpRequest'
import { useAuth0 } from '@auth0/auth0-react'
import ToastCustom from './components/ToastCustom.tsx/ToastCustom'
import { disconnectSocket } from './config/socket'

function App() {
  const { logout } = useAuth0()

  useEffect(() => {
    injectAuth0Functions(logout)

    // Cleanup socket connection on app unmount
    return () => {
      disconnectSocket()
    }
  }, [logout])

  return (
    <>
      <Router>
        <Routes>
          {publicRoutes.map((route, index) => {
            let Layout = route.layout
            let Component = route.component
            if (Component === null) {
              Component = React.Fragment
            }
            if (Layout === null) {
              Layout = React.Fragment
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Component />
                  </Layout>
                }
              />
            )
          })}
          {
            // Add private routes
            privateRoutes.map((route, index) => {
              let Layout = route.layout
              let Component = route.component
              if (Component === null) {
                Component = React.Fragment
              }
              if (!Layout) {
                Layout = React.Fragment
              }
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Component />
                      </Layout>
                    </PrivateRoute>
                  }
                />
              )
            })
          }
        </Routes>
      </Router>
      <ToastCustom />
    </>
  )
}

export default App
