import { Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from '../layouts/PublicLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { TenantLayout } from '../layouts/TenantLayout'
import { LandingPage } from '../pages/LandingPage'
import { ListingDetails } from '../pages/ListingDetails'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'
import { LandlordDashboard } from '../pages/dashboard/LandlordDashboard'
import { PropertiesPage } from '../pages/dashboard/PropertiesPage'
import { TenantsPage } from '../pages/dashboard/TenantsPage'
import { MaintenancePage } from '../pages/dashboard/MaintenancePage'
import { AssistantPage } from '../pages/dashboard/AssistantPage'
import { AnalyticsPage } from '../pages/dashboard/AnalyticsPage'
import { SettingsPage } from '../pages/dashboard/SettingsPage'
import { TenantDashboard } from '../pages/tenant/TenantDashboard'
import { TenantPayments } from '../pages/tenant/TenantPayments'
import { TenantPaymentGateway } from '../pages/tenant/TenantPaymentGateway'
import { TenantMaintenance } from '../pages/tenant/TenantMaintenance'
import { TenantLease } from '../pages/tenant/TenantLease'
import { TenantProfile } from '../pages/tenant/TenantProfile'
import { TenantNotifications } from '../pages/tenant/TenantNotifications'
import { TenantAssistant } from '../pages/tenant/TenantAssistant'
import { NotFound } from '../pages/NotFound'
import { useUserStore } from '../store/useUserStore'

function AuthGuard({ children }) {
  const { isAuthenticated } = useUserStore()
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }
  return children
}

function RoleGuard({ role, children }) {
  const { role: currentRole } = useUserStore()
  if (currentRole && currentRole !== role) {
    return <Navigate to={currentRole === 'tenant' ? '/tenant/dashboard' : '/dashboard'} replace />
  }
  return children
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route
        element={
          <AuthGuard>
            <RoleGuard role="landlord">
              <DashboardLayout />
            </RoleGuard>
          </AuthGuard>
        }
      >
        <Route path="/dashboard" element={<LandlordDashboard />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/tenants" element={<TenantsPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route
        element={
          <AuthGuard>
            <RoleGuard role="tenant">
              <TenantLayout />
            </RoleGuard>
          </AuthGuard>
        }
      >
        <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        <Route path="/tenant/payments" element={<TenantPayments />} />
        <Route path="/tenant/payments/checkout" element={<TenantPaymentGateway />} />
        <Route path="/tenant/maintenance" element={<TenantMaintenance />} />
        <Route path="/tenant/lease" element={<TenantLease />} />
        <Route path="/tenant/profile" element={<TenantProfile />} />
        <Route path="/tenant/notifications" element={<TenantNotifications />} />
        <Route path="/tenant/assistant" element={<TenantAssistant />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
