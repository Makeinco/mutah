import { ImagePlus, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/mutah/auth";
import { useLang } from "@/lib/mutah/i18n";
import {
  adminUploadFacilityDisplayImage,
  proposeFacilityDisplayImage,
} from "@/lib/mutah/operational";
import type { Facility } from "@/lib/mutah/types";
import { Button, Card } from "./ui";

export function OfficialImageAction({ facility }: { facility: Facility }) {
  const { user, profile } = useAuth();
  const { lang } = useLang();
  const ar = lang === "ar";
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  if (
    !user ||
    !facility.databaseId ||
    (profile?.role !== "contributor" && profile?.role !== "admin")
  )
    return null;
  const admin = profile.role === "admin";
  const label = admin
    ? facility.imageUrl
      ? ar
        ? "تغيير الصورة"
        : "Change photo"
      : ar
        ? "إضافة صورة"
        : "Add photo"
    : facility.imageUrl
      ? ar
        ? "اقتراح تغيير الصورة"
        : "Suggest photo change"
      : ar
        ? "اقتراح صورة"
        : "Suggest a photo";
  const submit = async () => {
    if (!file) return;
    setBusy(true);
    setMessage("");
    try {
      if (admin) {
        if (note.trim().length < 4) {
          setMessage(ar ? "أضف سببًا موجزًا للتغيير." : "Add a brief change reason.");
          return;
        }
        await adminUploadFacilityDisplayImage(facility.databaseId!, file, note);
        setMessage(
          ar ? "نُشرت الصورة الرسمية وسُجل التغيير." : "Official photo published and audited.",
        );
      } else {
        await proposeFacilityDisplayImage({
          facilityId: facility.databaseId!,
          userId: user.id,
          file,
          context: note,
        });
        setMessage(
          ar
            ? "أُرسلت الصورة الخاصة للمراجعة؛ لم تُنشر."
            : "Private photo sent for review; it was not published.",
        );
      }
      setFile(null);
      setNote("");
    } catch {
      setMessage(
        ar
          ? "لم تُحفظ الصورة ولم تتغير الصورة الرسمية."
          : "Photo was not saved; the official image is unchanged.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card className="mt-4">
      <h2 className="font-bold">{label}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {admin
          ? ar
            ? "صورة عامة رسمية منفصلة عن أدلة الوصول."
            : "A public official image, separate from access evidence."
          : ar
            ? "يبقى الملف خاصًا حتى يراجعه الفريق ويعتمده المدير."
            : "The file stays private until team review and admin approval."}
      </p>
      <input
        className="mt-3 block w-full text-sm"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      <textarea
        rows={2}
        className="mt-3 w-full rounded-xl border-2 border-input bg-background p-3 text-sm"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={
          admin
            ? ar
              ? "سبب التغيير (مطلوب)"
              : "Change reason (required)"
            : ar
              ? "سياق يساعد المراجع (اختياري)"
              : "Context for the reviewer (optional)"
        }
      />
      {message ? (
        <p role="status" className="mt-2 text-sm">
          {message}
        </p>
      ) : null}
      <Button className="mt-3" disabled={!file || busy} onClick={() => void submit()}>
        {busy ? <LoaderCircle className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
        {label}
      </Button>
    </Card>
  );
}
