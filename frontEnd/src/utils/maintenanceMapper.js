export function mapMaintenanceFromApi(ticket, propertyName = '') {
  return {
    id: ticket.id,
    title: ticket.issue,
    property: propertyName || ticket.property_id,
    category: ticket.category,
    priority: ticket.priority,
    cost: ticket.estimated_cost,
    vendor: ticket.assigned_vendor || 'Unassigned',
    status: ticket.status,
    summary: ticket.summary || '',
    timeline: [ticket.status]
  }
}
