"use client";

import { Bell, KeyRound, Link2, Moon, ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppFrame } from "@/components/dashboard/app-frame";
import { Card } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { PageHeader } from "@/components/ui/page-header";

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
}: {
  icon: typeof Moon;
  title: string;
  description: string;
  checked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-300">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
      <button
        aria-pressed={checked}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors ${checked ? "border-cyan-300/30 bg-cyan-300/30" : "border-white/10 bg-white/[0.05]"}`}
        type="button"
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

function SettingsContent() {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Workspace preferences"
        description="Configuration surfaces are ready for backend integration where APIs are not present yet."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-white">Preferences</h2>
          <div className="mt-5 space-y-4">
            <ToggleRow icon={Moon} title="Theme" description="Dark theme with cyan accents is active." checked />
            <ToggleRow icon={Bell} title="Notifications" description="Receive product and analysis updates when notification APIs are available." />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white">Security</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="flex items-center gap-3">
                <KeyRound size={18} className="text-cyan-300" />
                <h3 className="text-sm font-semibold text-white">Change Password</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">Password management UI is prepared for an account API.</p>
              <button className="button-secondary mt-4" type="button">Update Password</button>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="flex items-center gap-3">
                <Link2 size={18} className="text-cyan-300" />
                <h3 className="text-sm font-semibold text-white">Connected Google Account</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">Google connection status will use auth provider data when exposed.</p>
              <button className="button-secondary mt-4" type="button">Manage Connection</button>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-rose-400/20 bg-rose-400/[0.045]">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-1 text-rose-300" size={20} />
            <div>
              <h2 className="text-lg font-semibold text-white">Delete Account</h2>
              <p className="mt-2 text-sm leading-6 text-rose-100/75">This UI is intentionally confirmation-gated until a delete account API exists.</p>
            </div>
          </div>
          <button className="button-secondary border-rose-300/20 text-rose-200 hover:bg-rose-400/10" onClick={() => setConfirmDelete(true)} type="button">
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>
      </Card>

      <ConfirmationDialog
        open={confirmDelete}
        title="Delete account?"
        description="Account deletion is not connected to a backend endpoint yet, so this confirmation only demonstrates the intended UI flow."
        confirmLabel="I understand"
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => setConfirmDelete(false)}
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppFrame>
      <SettingsContent />
    </AppFrame>
  );
}
