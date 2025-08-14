import Link from "next/link"
import { SolarLogo } from "../../../public/SolarLogo"
const CURRENT_YEAR = new Date().getFullYear()

const Footer = () => {
  return (
    <div className="px-4 xl:px-0">
      <footer
        id="footer"
        className="relative mx-auto flex max-w-6xl flex-wrap pt-4"
      >
        {/* Vertical Lines */}
        <div className="pointer-events-none inset-0">
          {/* Left */}
          <div
            className="absolute inset-y-0 my-[-5rem] w-px"
            style={{
              maskImage: "linear-gradient(transparent, white 5rem)",
            }}
          >
            <svg className="h-full w-full" preserveAspectRatio="none">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                className="stroke-gray-300"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            </svg>
          </div>

          {/* Right */}
          <div
            className="absolute inset-y-0 right-0 my-[-5rem] w-px"
            style={{
              maskImage: "linear-gradient(transparent, white 5rem)",
            }}
          >
            <svg className="h-full w-full" preserveAspectRatio="none">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                className="stroke-gray-300"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            </svg>
          </div>
        </div>
        <svg
          className="mb-10 h-20 w-full border-y border-dashed border-gray-300 stroke-gray-300"
          // style={{
          //   maskImage:
          //     "linear-gradient(transparent, white 10rem, white calc(100% - 10rem), transparent)",
          // }}
        >
          <defs>
            <pattern
              id="diagonal-footer-pattern"
              patternUnits="userSpaceOnUse"
              width="64"
              height="64"
            >
              {Array.from({ length: 17 }, (_, i) => {
                const offset = i * 8
                return (
                  <path
                    key={i}
                    d={`M${-106 + offset} 110L${22 + offset} -18`}
                    stroke=""
                    strokeWidth="1"
                  />
                )
              })}
            </pattern>
          </defs>
          <rect
            stroke="none"
            width="100%"
            height="100%"
            fill="url(#diagonal-footer-pattern)"
          />
        </svg>
        <div className="flex w-full flex-col items-center justify-center space-y-4 px-4 lg:flex-row lg:justify-between lg:space-y-0">
          <Link
            href="/"
            className="flex items-center font-medium text-gray-700 select-none"
          >
            <SolarLogo className="w-28" />
            <span className="sr-only">proClaim Logo (go home)</span>
          </Link>

          <div className="flex flex-col items-center space-y-2 text-center lg:items-end lg:text-right">
            <div className="text-sm text-gray-600">
              Created by{" "}
              <span className="font-medium text-gray-900">Tsotne Bukiya</span>{" "}
              and <span className="font-medium text-gray-900">Eoin Burton</span>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {CURRENT_YEAR} proClaim
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
