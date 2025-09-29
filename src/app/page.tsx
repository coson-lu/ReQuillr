import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex gap-5 absolute w-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link type='button' href='/copywork' className="px-10 py-5 rounded-md shadow-sm font-header font-semibold text-xl tracking-wide text-[#111] bg-white/90 border border-black/5 transition-transform transform hover:-translate-y-1 hover:shadow-md">Copywork</Link>
          <Link type='button' href='/recreate' className="px-10 py-5 rounded-md shadow-sm font-header font-semibold text-xl tracking-wide text-[#111] bg-white/90 border border-black/5 transition-transform transform hover:-translate-y-1 hover:shadow-md">Recreate</Link>
        </div>
        <p className="font-light text-center absolute left-1/2 -translate-x-1/2 top-[calc(50%+4rem)] w-auto hover:underline underline-offset-2 hover:cursor-pointer">What's this?</p>
      </div>
    </div>
  );
}
