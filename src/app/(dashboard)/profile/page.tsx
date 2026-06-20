"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Briefcase } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] py-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="mt-2 text-gray-400">Manage your account information</p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-300">First Name</Label>
                    <Input
                      placeholder="John"
                      className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-300">Last Name</Label>
                    <Input
                      placeholder="Doe"
                      className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-gray-300">Email</Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    disabled
                    className="border-white/10 bg-white/[0.03] text-white/50 placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-gray-300">Phone</Label>
                  <Input
                    placeholder="+1 234 567 890"
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-300">Company</Label>
                    <Input
                      placeholder="Company name"
                      className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-300">Job Title</Label>
                    <Input
                      placeholder="Software Engineer"
                      className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-xl">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: User, label: "Member since", value: "2026" },
                  { icon: Mail, label: "Email verified", value: "Yes" },
                  { icon: Briefcase, label: "Total Orders", value: "0" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                      <item.icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="font-medium text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
