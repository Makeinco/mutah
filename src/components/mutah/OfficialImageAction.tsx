import { Link } from "@tanstack/react-router";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  const userId = user?.id;
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );
  const eligible =
    Boolean(userId && facility.databaseId) &&
    (profile?.role === "contributor" || profile?.role === "admin");
  const admin = profile?.role === "admin";
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
        ? "اقترح تحديث الصورة"
        : "Suggest photo update"
      : ar
        ? "اقترح صورة للمرفق"
        : "Suggest a facility photo";
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
          userId: userId!,
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

  if (!eligible) {
    if (facility.imageUrl) return null;
    return (
      <Card className="mt-4 border-2 border-dashed border-input bg-surface">
        <h2 className="font-bold">{ar ? "لا توجد صورة رسمية بعد" : "No official photo yet"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {ar
            ? "هذه الصورة لعرض المرفق فقط، ولا تُستخدم تلقائيًا كدليل على الإتاحة."
            : "This photo is for the facility display only and is not automatically used as accessibility evidence."}
        </p>
        {!user && facility.databaseId ? (
          <Link
            to="/account"
            className="mt-3 inline-flex min-h-11 items-center rounded-xl border-2 border-primary px-4 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ar ? "اقترح صورة للمرفق" : "Suggest a facility photo"}
          </Link>
        ) : null}
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <h2 className="font-bold">{label}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {ar
          ? "هذه الصورة لعرض المرفق فقط، ولا تُستخدم تلقائيًا كدليل على الإتاحة."
          : "This photo is for the facility display only and is not automatically used as accessibility evidence."}
      </p>
      {!admin ? (
        <p className="mt-1 text-sm text-muted-foreground">
          {ar
            ? "يبقى الملف خاصًا حتى يراجعه الفريق ويعتمده المدير."
            : "The file stays private until team review and admin approval."}
        </p>
      ) : null}
      <input
        className="mt-3 block w-full text-sm"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      {previewUrl ? (
        <figure className="mt-3">
          <img
            src={previewUrl}
            alt={
              ar
                ? "معاينة صورة عرض المرفق المقترحة"
                : "Preview of the proposed facility display photo"
            }
            className="aspect-video w-full rounded-xl object-cover"
          />
          <figcaption className="mt-1 text-xs text-muted-foreground">
            {ar ? "معاينة قبل الإرسال" : "Preview before submission"}
          </figcaption>
        </figure>
      ) : null}
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
