import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

export function TenantProfile() {
  return (
    <div className="space-y-6 pb-20">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-ink-900">Tenant profile</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input placeholder="Full name" />
          <Input placeholder="Phone" />
          <Input placeholder="Email" />
          <Input placeholder="Emergency contact" />
        </div>
        <Button className="mt-6">Save profile</Button>
      </Card>
    </div>
  )
}
