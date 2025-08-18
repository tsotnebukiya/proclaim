"use client"

import ReactPlayer from "react-player"

export default function VideoPlayer() {
  return (
    <section
      id="demo"
      className="relative mx-auto w-full max-w-6xl overflow-hidden"
    >
      <div className="mb-4">
        <h2 className="relative text-lg font-semibold tracking-tight text-orange-500">
          Product Demo
          <div className="absolute top-1 -left-[8px] h-5 w-[3px] rounded-r-sm bg-orange-500" />
        </h2>
        <p className="mt-2 max-w-2xl text-3xl font-semibold tracking-tighter text-balance text-gray-900 md:text-4xl">
          Claims to cash on‑chain in 90 seconds
        </p>
      </div>
      {/* Responsive video container with 16:9 aspect ratio */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
        <ReactPlayer
          src="https://www.youtube.com/watch?v=HRDKvPwNRW4"
          width="100%"
          height="100%"
          controls
          playing={false}
          light={false}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </div>
    </section>
  )
}
