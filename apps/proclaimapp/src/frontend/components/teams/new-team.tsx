"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/frontend/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { Switch } from "@/frontend/components/ui/switch";
import { Input } from "@/frontend/components/ui/input";
import { CreateTeamType, createTeamSchema } from "@/server/lib/schemas";

type Props = {
  onSuccess?: () => {};
  setOpen: Dispatch<SetStateAction<boolean>>;
};

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { api } from "@/trpc/react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { shortenAddress } from "@/frontend/lib/utils";

const markets = ["ICSD", "US", "UK", "DE", "AU", "CA"];

export default function NewTeamModal({ setOpen, onSuccess }: Props) {
  const { mutate, isPending } = api.teams.createTeam.useMutation({
    onSuccess: (res) => {
      setOpen(false);
      toast.success("Success", {
        description: `Team ${res.name} created <br /> Contract deployed ${shortenAddress(res.contractAddress)}`,
      });
      onSuccess && onSuccess();
    },
    onError: (err) => {
      toast.error("Error", {
        description: err.message,
      });
    },
  });
  const form = useForm<CreateTeamType>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      account: "",
      market: "",
      stp: false,
      teamName: "",
    },
  });
  console.log(form.getValues("market"));
  function onSubmit(values: CreateTeamType) {
    mutate(values);
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create new team</DialogTitle>
        <DialogDescription>
          This action will add new team/workspace and deploy smart contract on
          the blockchain.
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 pt-6"
          >
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="CA Mandatory" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select market handled by team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {markets.map((el) => (
                        <SelectItem value={el} key={el}>
                          {el}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accout Number</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stp"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">STP</FormLabel>
                    <FormDescription>
                      Automatically upload and settle claims
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2" loading={isPending}>
              Create
            </Button>
          </form>
        </Form>
      </DialogHeader>
    </DialogContent>
  );
}
