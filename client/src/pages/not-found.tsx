import { button } from "@/components/ui/button";
import { Button } from "react-aria-components";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="grid justify-center items-center h-dvh">
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl">404 Not Found</h1>
        <Button
          className={button({ class: "w-full" })}
          onPress={() => navigate(-1)}
        >
          Go back
        </Button>
      </div>
    </div>
  );
}
