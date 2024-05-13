"use client";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/frontend/components/ui/card";
import { Label } from "@/frontend/components/ui/label";
import { Input } from "@/frontend/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/frontend/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/frontend/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/frontend/components/ui/form";
import { Button } from "@/frontend/components/ui/button";
import { NewClaim, newClaimSchema } from "@/server/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../../ui/calendar";
import { cn } from "@/frontend/lib/utils";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UploadOne({ workspace }: { workspace: string }) {
  const router = useRouter();
  const form = useForm<NewClaim>({
    resolver: zodResolver(newClaimSchema),
    defaultValues: {
      actualSettlementDate: new Date(),
      amount: 0,
      contractualSettlementDate: new Date(),
      corporateAction: "Redemption",
      corporateActionID: "",
      counterparty: "",
      currency: "USDt",
      eventRate: 0,
      payDate: new Date(),
      quantity: 0,
      tradeReference: "",
      type: "Receivable",
    },
  });
  const { mutate, isPending } = api.workspace.claims.createClaim.useMutation({
    onSuccess: (res) => {
      toast.success("Success", {
        description: `Claim ${form.getValues("tradeReference")} created`,
      });
      router.push(`claims/${form.getValues("tradeReference")}`);
    },
    onError: (err) => {
      toast.error("Error", {
        description: err.message,
      });
    },
  });
  function onSubmit(values: NewClaim) {
    mutate({
      claim: values,
      workspace,
    });
  }
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Enter claim details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tradeReference"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Ref</FormLabel>
                    <FormControl>
                      <Input placeholder="5623644321" {...field} />
                    </FormControl>
                    <FormDescription>Trade reference</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contractualSettlementDate"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>CSD</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Trade contractual settlement date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="actualSettlementDate"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>ASD</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Trade actual settlement date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        className="remove-arrow"
                        placeholder="50,000"
                        {...field}
                        type="number"
                        onChange={(event) =>
                          field.onChange(Number(event.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>Amount of shares</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USDt">USD</SelectItem>
                        <SelectItem value="EURt">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Settlement currency</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="counterparty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CP</FormLabel>
                    <FormControl>
                      <Input placeholder="83934" {...field} />
                    </FormControl>
                    <FormDescription>Counterparty Account</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex h-[40px] flex-1 gap-6"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Receivable" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Receivable
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Payable" />
                          </FormControl>
                          <FormLabel className="font-normal">Payable</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>Claim Type</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="corporateActionID"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Event ID</FormLabel>
                      <FormControl>
                        <Input placeholder="CA34234234" {...field} />
                      </FormControl>
                      <FormDescription>Corporate Action ID</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="corporateAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Interest Payment">
                            Interest Payment
                          </SelectItem>
                          <SelectItem value="Redemption">Redemption</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Corporate action type</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1.52"
                          {...field}
                          type="number"
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>Event Rate</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="100,00"
                          {...field}
                          type="number"
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>Claim amount</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payDate"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>PD</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Event PayDate</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-1 items-end">
                <Button type="submit" className="w-full" loading={isPending}>
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
