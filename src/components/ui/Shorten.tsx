import { Button } from "./Button";

export const Shorten: React.FC = () => {
  return (
    <form className="flex flex-col md:flex-row gap-y-4 md:gap-x-6 bg-dark-violet p-4 md:p-16 rounded-md w-full bg-shorten-mobile md:bg-shorten-desktop bg-no-repeat bg-right-top md:bg-cover">
      <input
        type="text"
        placeholder="Shorten a link here..."
        className="p-4 border flex-1 border-grayish-violet rounded-md"
      />
      <Button type="submit" rounded={false}>
        Shorten It!
      </Button>
    </form>
  );
};
