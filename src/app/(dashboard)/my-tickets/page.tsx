"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, ArrowRight, Sparkles } from "lucide-react";

export default function MyTicketsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] py-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white">My Tickets</h1>
          <p className="mt-2 text-gray-400">View and manage your purchased tickets</p>
        </motion.div>

        <motion.div
          className="mt-8 grid gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="col-span-full border border-white/10 bg-white/[0.03] backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <Ticket className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">No Tickets Yet</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                You haven&apos;t purchased any tickets yet. Browse events to get started!
              </p>
              <Link href="/events">
                <Button className="mt-4 gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-xl">
                  Browse Events <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
