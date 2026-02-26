import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { DemoProvider } from './contexts/DemoContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { GlassFilter } from './components/ui/LiquidGlass'

import { Landing } from './pages/Landing'
import { ClientLayout } from './layouts/ClientLayout'
import { FreelancerLayout } from './layouts/FreelancerLayout'

import { ClientDashboard } from './pages/client/Dashboard'
import { PostJob } from './pages/client/PostJob'
import { MyJobs } from './pages/client/MyJobs'
import { ClientJobDetail } from './pages/client/JobDetail'
import { DeployContracts } from './pages/DeployContracts'
import { FreelancerProfile } from './pages/client/FreelancerProfile'

import { FreelancerDashboard } from './pages/freelancer/Dashboard'
import { BrowseJobs } from './pages/freelancer/BrowseJobs'
import { MyProposals } from './pages/freelancer/MyProposals'
import { ActiveContracts } from './pages/freelancer/ActiveContracts'
import { MyProfile } from './pages/freelancer/MyProfile'
import { FreelancerJobDetail } from './pages/freelancer/JobDetail'
import { Messages } from './pages/shared/Messages'

export default function App() {
  return (
    <ThemeProvider>
      <GlassFilter />
      <DemoProvider>
        <ErrorBoundary>
          <Router>
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: 'mono',
                style: {
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-default)',
                  borderLeft: '4px solid var(--quai-green)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }
              }}
            />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/deploy" element={<DeployContracts />} />

              {/* Client Portal */}
              <Route path="/client" element={<ClientLayout />}>
                <Route index element={<ClientDashboard />} />
                <Route path="post-job" element={<PostJob />} />
                <Route path="my-jobs" element={<MyJobs />} />
                <Route path="jobs/:id" element={<ClientJobDetail />} />
                <Route path="freelancer/:address" element={<FreelancerProfile />} />
              </Route>

              {/* Freelancer Portal */}
              <Route path="/freelancer" element={<FreelancerLayout />}>
                <Route index element={<FreelancerDashboard />} />
                <Route path="jobs" element={<BrowseJobs />} />
                <Route path="jobs/:id" element={<FreelancerJobDetail />} />
                <Route path="proposals" element={<MyProposals />} />
                <Route path="contracts" element={<ActiveContracts />} />
                <Route path="messages/:id" element={<Messages />} />
                <Route path="profile" element={<MyProfile />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ErrorBoundary>
      </DemoProvider>
    </ThemeProvider>
  )
}
