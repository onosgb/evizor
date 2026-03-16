"use client";
import { toast } from "sonner";
type ToastProps = {
  message: string;
};
export function ToastError({ message }: ToastProps) {
  return toast.error(message, {
    position: "top-right",
    richColors: true,
  });
}

export function ToastSuccess({ message }: ToastProps) {
  return toast.success(message, {
    position: "top-right",
    richColors: true,
  });
}

export function ToastInfo({ message }: ToastProps) {
  return toast(message, {
    position: "top-right",
    richColors: true,
  });
}

export function ToastLoading({ message }: ToastProps) {
  return toast(message, {
    position: "top-right",
    richColors: true,
    duration: 2000,
  });
}

export function ToastWarning({ message }: ToastProps) {
  return toast.warning(message, {
    position: "top-right",
    richColors: true,
  });
}
