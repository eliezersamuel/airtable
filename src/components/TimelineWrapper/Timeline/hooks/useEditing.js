import { useState, useCallback } from "react";

export function useEditing({ setData }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  const startEdit = useCallback((id, current) => {
    setEditingId(id);
    setDraft(current);
  }, []);

  const commit = useCallback(
    (id) => {
      setData((prev) =>
        prev.map((x) => (x.id === id ? { ...x, name: draft.trim() || x.name } : x))
      );
      setEditingId(null);
    },
    [draft, setData]
  );

  const cancelEdit = useCallback(() => setEditingId(null), []);

  return { editingId, draft, startEdit, commit, cancelEdit, setDraft };
}
