import { Button } from "./Button";

export const Shorten: React.FC = () => {
  return (
    <form className="flex w-full flex-col gap-y-4 rounded-md bg-dark-violet bg-shorten-mobile bg-right-top bg-no-repeat p-4 md:flex-row md:gap-x-6 md:bg-shorten-desktop md:bg-cover md:p-16">
      <input
        type="text"
        placeholder="Shorten a link here..."
        className="flex-1 rounded-md border border-grayish-violet p-4"
      />
      <Button type="submit" rounded={false}>
        Shorten It!
      </Button>
    </form>
  );
};
