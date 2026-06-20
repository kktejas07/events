"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewEventPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold">Create New Event</h2>
          <p className="text-muted-foreground">Fill in the details to create a new event</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Event Title</Label>
            <Input placeholder="Enter event title" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Start Date</Label>
              <Input type="datetime-local" />
            </div>
            <div className="space-y-1">
              <Label>End Date</Label>
              <Input type="datetime-local" />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Status</Label>
            <Select defaultValue="DRAFT">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Category</Label>
            <Input placeholder="Technology, Business, Education..." />
          </div>

          <div className="space-y-1">
            <Label>Venue Name</Label>
            <Input placeholder="Venue name" />
          </div>

          <div className="space-y-1">
            <Label>Venue Address</Label>
            <Input placeholder="Full address" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>City</Label>
              <Input placeholder="City" />
            </div>
            <div className="space-y-1">
              <Label>Country</Label>
              <Input placeholder="Country" />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Short Description</Label>
            <Input placeholder="Brief description for cards" />
          </div>

          <div className="space-y-1">
            <Label>Full Description</Label>
            <textarea
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Detailed event description..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button>Create Event</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
