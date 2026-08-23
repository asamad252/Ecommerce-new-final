"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import "./PillNav.css";

interface PillNavItem {
  label: string;
  href: string;
  isCategory?: boolean;
}

interface PillNavProps {
  items: PillNavItem[];
  activeHref?: string;
  logoHref?: string;
  onItemClick?: (item: PillNavItem) => void;
}

export default function PillNav({
  items = [],
  activeHref,
  logoHref = "/",
  onItemClick,
}: PillNavProps) {
  const circleRefs = useRef<
    HTMLSpanElement[]
  >([]);

  const timelines = useRef<
    gsap.core.Timeline[]
  >([]);

  const logoRef = useRef<HTMLAnchorElement>(null);
  const logoImageRef =
    useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const setup = () => {
      circleRefs.current.forEach(
        (circle, index) => {
          if (
            !circle ||
            !circle.parentElement
          ) {
            return;
          }

          const pill =
            circle.parentElement;

          const rect =
            pill.getBoundingClientRect();

          const width = rect.width;
          const height = rect.height;

          const radius =
            ((width * width) / 4 +
              height * height) /
            (2 * height);

          const diameter =
            Math.ceil(radius * 2) + 2;

          const delta =
            Math.ceil(
              radius -
                Math.sqrt(
                  Math.max(
                    0,
                    radius * radius -
                      (width * width) / 4
                  )
                )
            ) + 1;

          circle.style.width =
            `${diameter}px`;

          circle.style.height =
            `${diameter}px`;

          circle.style.bottom =
            `-${delta}px`;

          gsap.set(circle, {
            xPercent: -50,
            scale: 0,
            transformOrigin:
              `50% ${
                diameter - delta
              }px`,
          });

          const label =
            pill.querySelector(
              ".pill-label"
            ) as HTMLElement | null;

          const hoverLabel =
            pill.querySelector(
              ".pill-label-hover"
            ) as HTMLElement | null;

          if (!label || !hoverLabel) {
            return;
          }

          gsap.set(label, {
            y: 0,
          });

          gsap.set(hoverLabel, {
            y: height + 10,
            opacity: 0,
          });

          timelines.current[index]?.kill();

          const timeline =
            gsap.timeline({
              paused: true,
            });

          timeline.to(
            circle,
            {
              scale: 1.22,
              duration: 0.65,
              ease: "power3.out",
            },
            0
          );

          timeline.to(
            label,
            {
              y: -(height + 6),
              duration: 0.65,
              ease: "power3.out",
            },
            0
          );

          timeline.to(
            hoverLabel,
            {
              y: 0,
              opacity: 1,
              duration: 0.65,
              ease: "power3.out",
            },
            0
          );

          timelines.current[index] =
            timeline;
        }
      );
    };

    setup();

    window.addEventListener(
      "resize",
      setup
    );

    return () => {
      window.removeEventListener(
        "resize",
        setup
      );

      timelines.current.forEach(
        (timeline) =>
          timeline?.kill()
      );
    };
  }, [items]);

  const handleLogoEnter = () => {
    if (!logoImageRef.current) {
      return;
    }

    gsap.killTweensOf(
      logoImageRef.current
    );

    gsap.fromTo(
      logoImageRef.current,
      {
        rotate: 0,
        scale: 1,
      },
      {
        rotate: 360,
        scale: 1.08,
        duration: 0.45,
        ease: "power3.out",
      }
    );
  };

  const handleItemClick = (
    item: PillNavItem
  ) => {
    if (item.isCategory) {
      onItemClick?.(item);
    }
  };

  return (
    <nav className="nx-pill-nav">
      {/* Logo */}
      <Link
        href={logoHref}
        ref={logoRef}
        className="nx-logo"
        aria-label="NexGear"
        onMouseEnter={
          handleLogoEnter
        }
      >
        <span
          ref={logoImageRef}
        >
          N
        </span>
      </Link>

      {/* Navigation pills */}
      <div className="nx-pill-group">
        {items.map(
          (item, index) => {
            const active =
              activeHref ===
              item.href;

            const pillContent = (
              <>
                <span
                  className="nx-pill-circle"
                  ref={(element) => {
                    if (element) {
                      circleRefs.current[
                        index
                      ] = element;
                    }
                  }}
                />

                <span className="nx-pill-label-wrap">
                  <span className="pill-label">
                    {item.label}
                  </span>

                  <span
                    className="pill-label-hover"
                    aria-hidden="true"
                  >
                    {item.label}
                  </span>
                </span>
              </>
            );

            if (item.isCategory) {
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`nx-pill ${
                    active
                      ? "is-active"
                      : ""
                  }`}
                  onMouseEnter={() =>
                    timelines.current[
                      index
                    ]?.play()
                  }
                  onMouseLeave={() =>
                    timelines.current[
                      index
                    ]?.reverse()
                  }
                  onClick={() =>
                    handleItemClick(
                      item
                    )
                  }
                >
                  {pillContent}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nx-pill ${
                  active
                    ? "is-active"
                    : ""
                }`}
                onMouseEnter={() =>
                  timelines.current[
                    index
                  ]?.play()
                }
                onMouseLeave={() =>
                  timelines.current[
                    index
                  ]?.reverse()
                }
              >
                {pillContent}
              </Link>
            );
          }
        )}
      </div>
    </nav>
  );
}