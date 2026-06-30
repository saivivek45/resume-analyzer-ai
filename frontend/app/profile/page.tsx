"use client";

import { Camera, Mail, Pencil, ShieldCheck, User } from "lucide-react";
import { AppFrame } from "@/components/dashboard/app-frame";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

function ProfileContent() {
  const { user } = useAuth();
  const initials = user?.full_name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Account details"
        description="Manage your CareerPilot identity. Profile picture editing is prepared as UI until an upload API exists."
      />

      <Card>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative grid h-28 w-28 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300 text-4xl font-semibold text-slate-950">
              {initials || <User size={36} />}
              <button
                aria-label="Change profile picture"
                className="absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-slate-900 text-cyan-300 shadow-lg hover:bg-slate-800"
                type="button"
              >
                <Camera size={17} />
              </button>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-white">{user?.full_name}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                <Mail size={15} />
                {user?.email}
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1 text-xs font-medium text-emerald-300">
                <ShieldCheck size={14} />
                Authenticated
              </p>
            </div>
          </div>
          <button className="button-primary" type="button">
            <Pencil size={16} />
            Edit Profile
          </button>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-white">Personal Information</h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Name</span>
              <input className="form-input mt-2" defaultValue={user?.full_name} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Email</span>
              <input className="form-input mt-2" defaultValue={user?.email} disabled />
            </label>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">Account Metadata</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
              <dt className="text-slate-500">Login Method</dt>
              <dd className="font-medium text-white">Email or Google</dd>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
              <dt className="text-slate-500">Joined Date</dt>
              <dd className="font-medium text-white">Unavailable</dd>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
              <dt className="text-slate-500">User ID</dt>
              <dd className="font-mono text-xs text-slate-300">{user?.id}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AppFrame>
      <ProfileContent />
    </AppFrame>
  );
}
