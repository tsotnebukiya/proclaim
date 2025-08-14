import { useCallback } from "react"

export const useSmoothScroll = () => {
  const scrollToSection = useCallback(
    (sectionId: string, offset: number = 100) => {
      const element = document.getElementById(sectionId)
      if (element) {
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    },
    [],
  )

  return scrollToSection
}
