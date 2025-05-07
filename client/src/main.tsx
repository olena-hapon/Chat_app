import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/rootLayout/RootLayout.tsx'
import Homepage from './routes/homepage/Homepage.tsx'
import DashboardPage from "./routes/dashboardPage/DashboardPage.tsx"
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout.tsx'
import ChatPage from './routes/chatPage/ChatPage.tsx'
import SigninPage from './routes/signinPage/SigninPage.tsx'
import SignupPage from './routes/signupPage/SignupPage.tsx'

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
