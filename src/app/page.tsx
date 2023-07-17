import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-5 p-2">
      <h1 className="sm:text-8xl text-4xl font-extrabold tracking-wide text-white">
        NEXT <span className="text-shadow-lg shadow-cyan-800">Auth</span>
      </h1>
      <Link
        href={"/login"}
        className="py-2 px-4 rounded-sm bg-cyan-800 shadow shadow-cyan-300 text-lg font-semibold"
      >
        Try Next Auth
      </Link>

      <footer className="fixed bottom-0 text-sm mb-1">
        Made by{" "}
        <a
          href="https://twitter.com/muditwt"
          target="_blank"
          className="underline"
        >
          Mudit
        </a>
      </footer>
    </main>
  );
}
