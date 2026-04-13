"use client";

import { useState, useTransition } from "react";
import { addLeadNote } from "@/app/actions/leads";
import { formatDateTime } from "@/lib/utils";
import type { LeadNote } from "@/types";
import { useToast } from "@/components/ui/toast";
import { MessageSquare, Send, Loader2 } from "lucide-react";

export function LeadNotes({
  leadId,
  initialNotes,
  currentUserId,
  currentUserName,
}: {
  leadId: string;
  initialNotes: LeadNote[];
  currentUserId: string;
  currentUserName: string;
}) {
  const [notes, setNotes] = useState<LeadNote[]>(initialNotes);
  const [noteText, setNoteText] = useState("");
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = noteText.trim();
    if (!text) return;

    startTransition(async () => {
      const result = await addLeadNote(leadId, text);
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "error" });
      } else if (result.note) {
        // Optimistically add note to list
        const newNote: LeadNote = {
          ...result.note,
          users: { full_name: currentUserName },
        };
        setNotes((prev) => [...prev, newNote]);
        setNoteText("");
      }
    });
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-700">
          Internal Notes
          {notes.length > 0 && (
            <span className="ml-2 text-xs font-normal text-slate-400">({notes.length})</span>
          )}
        </h2>
      </div>

      <div className="p-5 space-y-4">
        {/* Existing notes */}
        {notes.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No notes yet. Add the first note below.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                  {(note.users?.full_name ?? "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-700">
                      {note.users?.full_name ?? "Staff"}
                    </span>
                    <span className="text-xs text-slate-400">{formatDateTime(note.created_at)}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-lg px-3.5 py-2.5 border border-slate-100">
                    {note.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add note form */}
        <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-100">
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-1">
              {currentUserName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }}
                placeholder="Add an internal note… (⌘↵ to submit)"
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!noteText.trim() || pending}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {pending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Add note
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
