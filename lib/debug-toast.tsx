import { toast } from "sonner";

export function debugToast(data: Object) {
  toast("You submitted the following values:", {
    description: (
      <pre className="bg-muted text-foreground/80 mt-2 w-[320px] overflow-x-auto rounded-md p-4">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
    position: "bottom-right",
    classNames: {
      content: "flex flex-col gap-2",
    },
    style: {
      "--border-radius": "calc(var(--radius)  + 4px)",
    } as React.CSSProperties,
    closeButton: true,
    duration: Infinity,
  });
}
