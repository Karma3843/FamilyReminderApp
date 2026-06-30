import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { familyService, type Family, type MemberInfo } from "@/services/familyService";
import { useAuth } from "@/context/AuthContext";
import { X } from "lucide-react";
import type { Reminder } from "@/services/reminderService";

interface EditReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder: Reminder | null;
  onSubmit: (data: {
    title: string;
    description: string;
    reminder_date: string;
    reminder_time: string;
    repeat: string;
    priority: string;
    family_id: number;
    tagged_users: number[];
  }) => void;
}

export function EditReminderModal({ open, onOpenChange, reminder, onSubmit }: EditReminderModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState("none");
  const [priority, setPriority] = useState("low");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);

  useEffect(() => {
    if (open && reminder) {
      setTitle(reminder.title);
      setDescription(reminder.description || "");
      setDate(reminder.reminder_date);
      setTime(reminder.reminder_time);
      setRepeat(reminder.repeat);
      setPriority(reminder.priority);
      setSelectedUsers(
        (reminder.tagged_users || []).map((u) => u.id)
      );
      familyService.getFamilies().then((f) => {
        setFamilies(f);
        setSelectedFamilyId(reminder.family_id || f[0]?.family_id || null);
      }).catch(() => {});
    }
  }, [open, reminder]);

  const selectedFamily = families.find((f) => f.family_id === selectedFamilyId);
  const memberList: MemberInfo[] = selectedFamily?.members || [];

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time || !reminder || selectedFamilyId === null) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      reminder_date: date,
      reminder_time: time,
      repeat,
      priority,
      family_id: selectedFamilyId,
      tagged_users: selectedUsers,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Reminder</DialogTitle>
          <DialogDescription>Update your reminder details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input id="edit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-time">Time</Label>
              <Input id="edit-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Repeat</Label>
              <Select value={repeat} onValueChange={setRepeat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Family</Label>
            <Select
              value={selectedFamilyId?.toString() || ""}
              onValueChange={(v) => {
                setSelectedFamilyId(Number(v));
                setSelectedUsers([]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a family" />
              </SelectTrigger>
              <SelectContent>
                {families.map((f) => (
                  <SelectItem key={f.family_id} value={f.family_id.toString()}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tag Family Members</Label>
            <div className="flex flex-wrap gap-2 rounded-lg border bg-gray-50 p-3">
              {!selectedFamilyId ? (
                <span className="text-sm text-gray-400">Select a family first</span>
              ) : memberList.length === 0 ? (
                <span className="text-sm text-gray-400">No family members available</span>
              ) : (
                memberList.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleUser(member.id)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-colors ${
                      selectedUsers.includes(member.id)
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-indigo-300"
                    }`}
                  >
                    {member.id === user?.id ? "(You)" : member.name}
                    {selectedUsers.includes(member.id) && <X className="size-3" />}
                  </button>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
