const AUTH_KEY = 'awadhlease-auth'
const TENANT_CONTEXT_KEY = 'awadhlease-tenant-context'

export function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveAuth(payload) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload))
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY)
}

export function loadTenantContext() {
  try {
    const raw = localStorage.getItem(TENANT_CONTEXT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveTenantContext(payload) {
  localStorage.setItem(TENANT_CONTEXT_KEY, JSON.stringify(payload))
}
