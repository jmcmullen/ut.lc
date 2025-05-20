import { Button } from "./Button";

export const Shorten: React.FC = () => {
  return (
    <form className="flex flex-col gap-y-4 bg-dark-violet p-4 rounded-md w-full bg- bg-shorten-mobile md:bg-shorten-desktop bg-no-repeat bg-right-top">
      <input
        type="text"
        placeholder="Shorten a link here..."
        className="p-4 border border-grayish-violet rounded-md"
      />
      <Button type="submit" rounded={false}>
        Shorten It!
      </Button>
    </form>
  );
};
