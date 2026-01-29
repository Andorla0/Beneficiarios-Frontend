import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { CreateBeneficiaryRequest, IdentityDocumentDto } from "../../../shared/types/domain";
import { Button } from "../../../shared/ui/Button/Button";
import { Input } from "../../../shared/ui/Input/Input";
import { Select } from "../../../shared/ui/Select/Select";

type Props = {
  documents: IdentityDocumentDto[];
  defaultValues?: Partial<CreateBeneficiaryRequest>;
  submitLabel: string;
  onSubmit: (values: CreateBeneficiaryRequest) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

function isValidDateYYYYMMDD(value: string) {
  // simple y suficiente para prueba técnica
  // valida patrón + fecha real (Date parse)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + "T00:00:00");
  return !Number.isNaN(d.getTime());
}

export function BeneficiaryForm({
  documents,
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
  isSubmitting,
}: Props) {
  const documentsById = useMemo(() => {
    const map = new Map<number, IdentityDocumentDto>();
    documents.forEach((d) => map.set(d.id, d));
    return map;
  }, [documents]);

  const schema = useMemo(() => {
    return z
      .object({
        firstNames: z.string().trim().min(1, "Nombres es requerido"),
        lastNames: z.string().trim().min(1, "Apellidos es requerido"),
        identityDocumentId: z
          .number({ error: "Tipo documento es requerido" })
          .int()
          .positive("Tipo documento es requerido"),
        documentNumber: z.string().trim().min(1, "Número documento es requerido"),
        birthDate: z
          .string()
          .trim()
          .min(1, "Fecha nacimiento es requerida")
          .refine(isValidDateYYYYMMDD, "Formato de fecha inválido (YYYY-MM-DD)"),
        gender: z.enum(["M", "F"], { message: "Género es requerido" }),
      })
      .superRefine((val, ctx) => {
        const doc = documentsById.get(val.identityDocumentId);
        if (!doc) return;

        const num = val.documentNumber ?? "";
        if (doc.numericOnly && !/^\d+$/.test(num)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["documentNumber"],
            message: "Este documento solo permite números",
          });
        }

        if (doc.length && num.length !== doc.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["documentNumber"],
            message: `Debe tener exactamente ${doc.length} caracteres`,
          });
        }
      });
  }, [documentsById]);

  const form = useForm<CreateBeneficiaryRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstNames: defaultValues?.firstNames ?? "",
      lastNames: defaultValues?.lastNames ?? "",
      identityDocumentId: defaultValues?.identityDocumentId ?? (documents[0]?.id ?? 0),
      documentNumber: defaultValues?.documentNumber ?? "",
      birthDate: defaultValues?.birthDate ?? "",
      gender: defaultValues?.gender ?? "M",
    },
    mode: "onTouched",
  });

  const identityDocumentId = useWatch({
    control: form.control,
    name: "identityDocumentId",
  });
  const firstNames = useWatch({
    control: form.control,
    name: "firstNames",
  });
  const lastNames = useWatch({
    control: form.control,
    name: "lastNames",
  });
  const documentNumber = useWatch({
    control: form.control,
    name: "documentNumber",
  });
  const birthDate = useWatch({
    control: form.control,
    name: "birthDate",
  });
  const gender = useWatch({
    control: form.control,
    name: "gender",
  });
  const selectedDoc = documentsById.get(identityDocumentId);

  useEffect(() => {
    // cuando cambia el tipo de documento, revalida el número
    void form.trigger("documentNumber");
  }, [identityDocumentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const docHint = selectedDoc
    ? `Requiere ${selectedDoc.length} caracteres${selectedDoc.numericOnly ? " (solo números)" : ""}`
    : undefined;

  const docOptions = documents.map((d) => ({
    value: String(d.id),
    label: `${d.abbreviation} - ${d.country}`,
  }));

  const genderOptions = [
    { value: "M", label: "M" },
    { value: "F", label: "F" },
  ];


  function sanitizeDocumentNumber(raw: string) {
  if (!selectedDoc) return raw;
  if (selectedDoc.numericOnly) return raw.replace(/\D/g, ""); // solo dígitos
  return raw;
}

  return (
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit(async (values) => onSubmit(values))}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nombres"
          placeholder="Ej. Juan Carlos"
          value={firstNames}
          onChange={(e) => form.setValue("firstNames", e.target.value, { shouldValidate: true })}
          error={form.formState.errors.firstNames?.message}
        />
        <Input
          label="Apellidos"
          placeholder="Ej. Pérez Gómez"
          value={lastNames}
          onChange={(e) => form.setValue("lastNames", e.target.value, { shouldValidate: true })}
          error={form.formState.errors.lastNames?.message}
        />

        <Select
          label="Tipo de documento"
          value={String(identityDocumentId || "")}
          onChange={(e) =>
            form.setValue("identityDocumentId", Number(e.target.value), { shouldValidate: true })
          }
          options={docOptions}
          placeholder="Seleccionar..."
          error={form.formState.errors.identityDocumentId?.message as string | undefined}
        />

        <Input
          label="Número de documento"
          placeholder={selectedDoc?.numericOnly ? "Solo números" : "Alfanumérico"}
          value={documentNumber}
          onChange={(e) => {
                const next = sanitizeDocumentNumber(e.target.value);
                form.setValue("documentNumber", next, { shouldValidate: true });
            }}
          error={form.formState.errors.documentNumber?.message}
          hint={docHint}
          inputMode={selectedDoc?.numericOnly ? "numeric" : undefined}
        />

        <Input
          label="Fecha de nacimiento"
          placeholder="YYYY-MM-DD"
          value={birthDate}
          onChange={(e) => form.setValue("birthDate", e.target.value, { shouldValidate: true })}
          error={form.formState.errors.birthDate?.message}
        />

        <Select
          label="Género"
          value={gender}
          onChange={(e) => form.setValue("gender", e.target.value as "M" | "F", { shouldValidate: true })}
          options={genderOptions}
          placeholder="Seleccionar..."
          error={form.formState.errors.gender?.message}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        ) : null}
      </div>
    </form>
  );
}
