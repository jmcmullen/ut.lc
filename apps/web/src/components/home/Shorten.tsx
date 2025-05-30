import { useState } from "react";
import { useForm } from "@tanstack/react-form";

import { handleForm } from "~/actions/cleanuriActions";
import { useUrlContext } from "~/contexts/UrlContext";
import { cleanuriRequestSchema } from "~/schemas/cleanuriSchemas";
import { cn } from "~/utils/cn";
import { Button } from "./Button";

export const Shorten = () => {
  const { addUrl, checkUrl } = useUrlContext();
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      url: "",
    },
    validators: {
      onChange: cleanuriRequestSchema,
    },
    onSubmit: async (data) => {
      const resp = await handleForm({ data: data.value });
      if ("resultUrl" in resp) {
        addUrl(resp);
        data.formApi.reset();
      } else {
        setError(resp.error);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  };

  return (
    <form
      className="bg-dark-violet bg-shorten-mobile md:bg-shorten-desktop flex w-full flex-col rounded-md bg-right-top bg-no-repeat p-4 md:bg-cover md:p-16"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-6">
        <form.Field
          name="url"
          validators={{
            onChange: ({ value }) =>
              checkUrl(value).exists
                ? { message: "You have already shortened this link" }
                : undefined,
          }}
        >
          {(field) => (
            <div className="flex w-full flex-col">
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                type="url"
                onChange={(e) => {
                  setError(null);
                  field.handleChange(e.target.value);
                }}
                placeholder="Shorten a link here..."
                className={cn(
                  "flex-1 rounded-md border-4 p-4 outline-none",
                  field.state.meta.isValid
                    ? "border-grayish-violet"
                    : "border-red",
                )}
              />
              {!field.state.meta.isValid && (
                <p role="alert" className="text-red mt-2">
                  {field.state.meta.errors.some(
                    (error) => error?.message === "Please add a link",
                  )
                    ? "Please add a link"
                    : field.state.meta.errors
                        .map((error) => error?.message ?? "")
                        .join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div>
              <Button
                type="submit"
                disabled={!canSubmit}
                rounded={false}
                size="lg"
                className="h-[70px] w-full whitespace-nowrap md:justify-start"
              >
                {isSubmitting ? "Loading..." : "Shorten It!"}
              </Button>
            </div>
          )}
        />
      </div>

      {error && (
        <p role="alert" className="text-red mt-2">
          {error}
        </p>
      )}
    </form>
  );
};
