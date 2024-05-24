import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  PlusCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "Interest Payment",
    label: "CA",
  },
  {
    value: "Redemption",
    label: "Lending",
  },
];

export const statuses = [
  {
    value: "settled",
    label: "Settled",
    icon: CheckCircledIcon,
    color: "text-teal-500",
  },
  {
    value: "pending",
    label: "Pending",
    icon: QuestionMarkCircledIcon,
    color: "text-amber-500",
  },
  {
    value: "upcoming",
    label: "Upcoming",
    icon: StopwatchIcon,
    color: "text-gray-500",
  },
];

export const priorities = [
  {
    label: "Payable",
    value: "Payable",
    icon: ArrowUpIcon,
  },
  {
    label: "Receivable",
    value: "Receivable",
    icon: ArrowDownIcon,
  },
];
