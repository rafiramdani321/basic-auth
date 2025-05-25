import { toast } from "sonner";

export const showToastError = (message: string) => {
  toast.error(message, {
    style: {
      color: "red",
      backgroundColor: "#ffe5e5",
      border: "1px solid #ff6b6b",
    },
  });
};

export const showToastSuccess = (message: string) => {
  toast.success(message, {
    style: {
      color: "green",
      backgroundColor: "#e6ffed",
      border: "1px solid #3fc77a",
    },
  });
};
