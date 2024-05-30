import Image from "next/image";
import { Navigation } from "../homepage/navigation";

export default function AboutComp() {
  return (
    <div className="flex flex-1 flex-col">
      <Navigation />
      <main className="flex flex-1 flex-col">
        <section
          aria-labelledby="global-database-title"
          className="shadow-about relative mx-auto mt-40 h-[700px] w-full max-w-7xl rounded-3xl p-24 shadow-black/30"
        >
          <Image src={"/mvp.svg"} fill alt="mvp" />
        </section>
        <section
          aria-labelledby="global-database-title"
          className="shadow-about relative mx-auto mb-10 mt-10 h-[700px] w-full max-w-7xl rounded-3xl p-24 shadow-black/30"
        >
          <Image src={"/smartcontracts.svg"} fill alt="smartcontracts" />
        </section>
      </main>
    </div>
  );
}
