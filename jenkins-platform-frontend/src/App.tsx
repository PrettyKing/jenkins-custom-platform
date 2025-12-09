import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store'

// Placeholder components - 实际项目中应该有完整的页面组件
const Layout = ({ children }: { children?: React.ReactNode }) => <div>{children || 'Layout Component'}</div>
const LoginPage = () => <div>Login Page</div>
const DashboardPage = () => <div>Dashboard Page</div>
const JobListPage = () => <div>Job List Page</div>
const JobDetailsPage = () => <div>Job Details Page</div>
const BuildDetailsPage = () => <div>Build Details Page</div>

// 受保护的路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <Routes>
      {/* 登录页面 */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 受保护的路由 */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="jobs" element={<JobListPage />} />
        <Route path="jobs/:jobName" element={<JobDetailsPage />} />
        <Route path="jobs/:jobName/builds/:buildNumber" element={<BuildDetailsPage />} />
      </Route>
      
      {/* 404 页面 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
