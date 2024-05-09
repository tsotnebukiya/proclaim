import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "Interest Payment",
    label: "CA Claim",
  },
  {
    value: "Redemption",
    label: "Lending",
  },
];

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "upcoming",
    label: "Upcoming",
    icon: StopwatchIcon,
  },
  {
    value: "settled",
    label: "Settled",
    icon: CheckCircledIcon,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: CrossCircledIcon,
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
