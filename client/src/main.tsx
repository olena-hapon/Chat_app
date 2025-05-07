import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// @ts-ignore
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/rootLayout/RootLayout'
import Homepage from './routes/homepage/Homepage'
import DashboardPage from "./routes/dashboardPage/DashboardPage"
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout'
import ChatPage from './routes/chatPage/ChatPage'
import SigninPage from './routes/signinPage/SigninPage'
import SignupPage from './routes/signupPage/SignupPage'

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [
      {
        path: "/",
        element: <Homepage/>
      },
      {
        path: "/sign-in/*",
        element: <SigninPage/>
      },
      {
        path: "/sign-up/*",
        element: <SignupPage/>
      },
      {
        element: <DashboardLayout/>,
        children: [
          {
            path:"/dashboard",
            element:<DashboardPage />
          },
          {
            path: "/dashboard/chats/:id",
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]); 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
