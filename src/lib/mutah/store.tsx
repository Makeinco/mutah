import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { FACILITIES, INITIAL_CONTRIBUTIONS } from "./data";
import { INDICATOR_ORDER } from "./labels";
import type {
  AccessNeed,
  Contribution,
  Facility,
  IndicatorEvidence,
  IndicatorKey,
} from "./types";

/**
 * Application state layer. Everything the UI mutates goes through here, so the
 * mock implementation can be swapped for Supabase mutations without touching
 * screens.
 */

interface MutahState {
  facilities: Facility[];
  contributions: Contribution[];
  needs: AccessNeed[];
  needsChosen: boolean;
  setNeeds: (needs: AccessNeed[]) => void;
  skipNeeds: () => void;
  getFacility: (id: string) => Facility | undefined;
  submitContribution: (input: {
    facilityId: string;
    imageUrl: string;
    aiObservations: IndicatorEvidence[];
    confirmed: Contribution["confirmed"];
  }) => string;
  approveContribution: (id: string, note: string) => void;
  rejectContribution: (id: string, note: string) => void;
  requestClarification: (id: string, note: string) => void;
}

const MutahContext = createContext<MutahState | null>(null);

let seq = 2000;

export function MutahProvider({ children }: { children: ReactNode }) {
  const [facilities, setFacilities] = useState<Facility[]>(FACILITIES);
  const [contributions, setContributions] = useState<Contribution[]>(INITIAL_CONTRIBUTIONS);
  const [needs, setNeedsState] = useState<AccessNeed[]>([]);
  const [needsChosen, setNeedsChosen] = useState(false);

  const setNeeds = useCallback((next: AccessNeed[]) => {
    setNeedsState(next);
    setNeedsChosen(true);
  }, []);

  const skipNeeds = useCallback(() => {
    setNeedsState([]);
    setNeedsChosen(true);
  }, []);

  const getFacility = useCallback(
    (id: string) => facilities.find((f) => f.id === id),
    [facilities],
  );

  const submitContribution: MutahState["submitContribution"] = useCallback(
    ({ facilityId, imageUrl, aiObservations, confirmed }) => {
      const id = `c-${++seq}`;
      const facility = FACILITIES.find((f) => f.id === facilityId);
      setContributions((prev) => [
        {
          id,
          facilityId,
          facilityName: facility?.name ?? "مرفق",
          imageUrl,
          submittedISO: new Date().toISOString().slice(0, 10),
          status: "pending_review",
          aiObservations,
          confirmed,
        },
        ...prev,
      ]);
      setFacilities((prev) =>
        prev.map((f) => (f.id === facilityId ? { ...f, verification: "pending_review" } : f)),
      );
      return id;
    },
    [],
  );

  const approveContribution = useCallback((id: string, note: string) => {
    setContributions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "approved", reviewerNote: note } : c)),
    );
    setContributions((current) => {
      const contribution = current.find((c) => c.id === id);
      if (contribution) {
        setFacilities((prev) =>
          prev.map((f) => {
            if (f.id !== contribution.facilityId) return f;
            const next = { ...f.indicators };
            for (const key of INDICATOR_ORDER) {
              const observed = contribution.aiObservations.find((o) => o.key === key);
              const confirmed = contribution.confirmed[key];
              if (!observed || !confirmed) continue;
              next[key] = {
                key,
                state: confirmed.state,
                note:
                  confirmed.action === "corrected"
                    ? "صححها المساهم بعد مراجعة الصورة."
                    : confirmed.action === "unsure"
                      ? "لم يتمكن المساهم من التأكد من هذا العنصر."
                      : observed.note,
              };
            }
            return {
              ...f,
              indicators: next,
              imageUrl: contribution.imageUrl || f.imageUrl,
              lastVerifiedISO: new Date().toISOString().slice(0, 10),
              verification: "team_reviewed",
              source: "contributor_image",
            } satisfies Facility;
          }),
        );
      }
      return current;
    });
  }, []);

  const rejectContribution = useCallback((id: string, note: string) => {
    setContributions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "rejected", reviewerNote: note } : c)),
    );
  }, []);

  const requestClarification = useCallback((id: string, note: string) => {
    setContributions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "clarification", reviewerNote: note } : c)),
    );
  }, []);

  const value = useMemo<MutahState>(
    () => ({
      facilities,
      contributions,
      needs,
      needsChosen,
      setNeeds,
      skipNeeds,
      getFacility,
      submitContribution,
      approveContribution,
      rejectContribution,
      requestClarification,
    }),
    [
      facilities,
      contributions,
      needs,
      needsChosen,
      setNeeds,
      skipNeeds,
      getFacility,
      submitContribution,
      approveContribution,
      rejectContribution,
      requestClarification,
    ],
  );

  return <MutahContext.Provider value={value}>{children}</MutahContext.Provider>;
}

export function useMutah(): MutahState {
  const ctx = useContext(MutahContext);
  if (!ctx) throw new Error("useMutah must be used inside MutahProvider");
  return ctx;
}

export function emptyConfirmations(
  observations: IndicatorEvidence[],
): Contribution["confirmed"] {
  return Object.fromEntries(
    observations.map((o) => [o.key, { state: o.state, action: "confirmed" as const }]),
  ) as Contribution["confirmed"];
}

export type { IndicatorKey };
