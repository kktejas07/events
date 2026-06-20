import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Building, Briefcase } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="mt-2 text-muted-foreground">Manage your account information</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>First Name</Label>
                <Input placeholder="John" />
              </div>
              <div className="space-y-1">
                <Label>Last Name</Label>
                <Input placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" placeholder="john@example.com" disabled />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input placeholder="+1 234 567 890" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Company</Label>
                <Input placeholder="Company name" />
              </div>
              <div className="space-y-1">
                <Label>Job Title</Label>
                <Input placeholder="Software Engineer" />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member since</p>
                <p className="font-medium">2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email verified</p>
                <p className="font-medium text-success">Yes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="font-medium">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
