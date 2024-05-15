"use client";

import * as React from "react";
import * as XLSX from "xlsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { getErrorMessage } from "@/frontend/lib/handle-error";
import { Button } from "@/frontend/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/frontend/components/ui/form";
import { FileUploader } from "../../file-uploader";
import { ReceivedClaimType } from "@/server/lib/schemas";
import { api } from "@/trpc/react";

const acceptTypes = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.ms-excel": [".xls"],
};

const schema = z.object({
  files: z
    .array(z.instanceof(File))
    .refine((el) => el[0], "Please attach a file"),
});

type Schema = z.infer<typeof schema>;

export default function UploadMany({ workspace }: { workspace: string }) {
  const { mutate, isPending } = api.workspace.claims.createMany.useMutation({
    onMutate: () => {
      toast.loading("Creating Claims", { id: "uploadClaim", description: "" });
    },
    onSuccess: (res) => {
      toast.success("Success", {
        description: `${res} claims created`,
        id: "uploadClaim",
      });
      form.reset();
    },
    onError: (err) => {
      toast.error("Error", {
        description: err.message,
        id: "uploadClaim",
      });
    },
  });
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      files: [],
    },
  });

  async function onSubmit(input: Schema) {
    const file = input.files[0]!;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]!];
    const json = XLSX.utils.sheet_to_json(worksheet!) as ReceivedClaimType[];
    mutate({ claims: json, workspace });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <div className="space-y-6">
              <FormItem className="w-full">
                <FormLabel>Excel File</FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    maxFiles={1}
                    maxSize={16 * 1024 * 1024}
                    accept={acceptTypes}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <Button size={"lg"} className="w-fit self-end" loading={isPending}>
          Upload
        </Button>
      </form>
    </Form>
  );
}
