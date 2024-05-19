import { GlobalProclaim } from "./cobe";
import { Navigation } from "./navigation";

export default function HomePageComp() {
  return (
    <div>
      <Navigation />
      <main className="flex flex-col overflow-hidden">
        <GlobalProclaim />
      </main>
    </div>
  );
}
