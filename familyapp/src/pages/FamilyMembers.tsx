import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { familyService, type Family, type MemberInfo } from "@/services/familyService";
import { EmptyState } from "@/components/EmptyState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { Users, Plus, X, Loader2, Crown, Shield } from "lucide-react";

export function FamilyMembers() {
  const { user } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [familyName, setFamilyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [addEmail, setAddEmail] = useState("");
  const [addingToFamily, setAddingToFamily] = useState<number | null>(null);

  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<number | null>(null);
  const [removingFromFamily, setRemovingFromFamily] = useState<number | null>(null);

  const fetchFamilies = () => {
    familyService
      .getFamilies()
      .then(setFamilies)
      .catch(() => setFamilies([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  const handleAddMember = async (familyId: number) => {
    if (!addEmail.trim()) return;
    setAddingToFamily(familyId);
    try {
      await familyService.addMember(addEmail.trim(), familyId);
      setAddEmail("");
      fetchFamilies();
      toast.success("Member added successfully");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to add member";
      toast.error(msg);
    } finally {
      setAddingToFamily(null);
    }
  };

  const handleRemoveMemberClick = (userId: number, familyId: number) => {
    setRemovingMemberId(userId);
    setRemovingFromFamily(familyId);
    setRemoveDialogOpen(true);
  };

  const handleRemoveMemberConfirm = async () => {
    if (removingMemberId === null || removingFromFamily === null) return;
    try {
      await familyService.removeMember(removingMemberId, removingFromFamily);
      fetchFamilies();
      toast.success("Member removed successfully");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to remove member";
      toast.error(msg);
    } finally {
      setRemoveDialogOpen(false);
      setRemovingMemberId(null);
      setRemovingFromFamily(null);
    }
  };

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!familyName.trim()) return;

    setCreating(true);
    try {
      await familyService.createFamily(familyName.trim());
      setFamilyName("");
      fetchFamilies();
      toast.success("Family created successfully");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Failed to create family";
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Family Members</h1>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      {families.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8">
          <EmptyState
            icon={Users}
            title="Start building your family circle"
            description="Create a family group to start sharing reminders with your loved ones."
            action={
              <form onSubmit={handleCreateFamily} className="flex w-full max-w-sm gap-2">
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="Family name (e.g. The Smiths)"
                  required
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
                >
                  {creating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                  Create
                </button>
              </form>
            }
          />
        </div>
      ) : (
        <div className="space-y-6">
          {families.map((family) => {
            const isUserAdmin = user?.id === family.created_by;
            return (
              <div key={family.family_id} className="rounded-2xl border bg-white overflow-hidden">
                <div className="flex items-center justify-between border-b bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-sm">
                      <Users className="size-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{family.name}</h2>
                      <p className="text-xs text-gray-500">
                        {family.members.length} member{family.members.length !== 1 ? "s" : ""}
                        {isUserAdmin ? " · You are admin" : " · You are a member"}
                      </p>
                    </div>
                  </div>
                  {isUserAdmin ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      <Crown className="size-3.5" />
                      Admin
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                      <Shield className="size-3.5" />
                      Member
                    </span>
                  )}
                </div>

                <div className="divide-y">
                  {family.members.map((member) => {
                    const isMemberAdmin = member.id === family.created_by;
                    const isCurrentUser = member.id === user?.id;
                    return (
                      <div key={member.id} className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white ${
                            isMemberAdmin
                              ? "bg-gradient-to-br from-amber-400 to-orange-500"
                              : "bg-gradient-to-br from-indigo-400 to-purple-500"
                          }`}>
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-900">{member.name}</p>
                              {isMemberAdmin && (
                                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                  <Crown className="size-3" />
                                  Admin
                                </span>
                              )}
                              {isCurrentUser && !isMemberAdmin && (
                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        {isUserAdmin && !isCurrentUser && (
                          <button
                            onClick={() => handleRemoveMemberClick(member.id, family.family_id)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <X className="size-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {isUserAdmin && (
                  <div className="border-t border-dashed bg-gray-50/50 px-6 py-4">
                    <form
                      onSubmit={(e) => { e.preventDefault(); handleAddMember(family.family_id); }}
                      className="flex gap-2"
                    >
                      <input
                        type="email"
                        value={addEmail}
                        onChange={(e) => setAddEmail(e.target.value)}
                        placeholder="Add member by email"
                        required
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      />
                      <button
                        type="submit"
                        disabled={addingToFamily === family.family_id}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {addingToFamily === family.family_id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Plus className="size-4" />
                        )}
                        Add
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Remove this member from the family? They will no longer have access to family reminders.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMemberConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
