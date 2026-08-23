"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface NavPillProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  active?: boolean;
  primary?: boolean;
  icon?: ReactNode;
  className?: string;
}

export default function NavPill({
  href,
  onClick,
  children,
  active = false,
  primary = false,
  icon,
  className = "",
}: NavPillProps) {
  const pillRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const circleRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const pill = pillRef.current;
    const circle = circleRef.current;
    const label = labelRef.current;

    if (!pill || !circle || !label) return;

    const rect = pill.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const radius =
      ((width * width) / 4 + height * height) /
      (2 * height);

    const diameter = Math.ceil(radius * 2) + 4;

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

    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    circle.style.bottom = `-${delta}px`;

    gsap.set(circle, {
      xPercent: -50,
      scale: 0,
      transformOrigin: `50% ${diameter - delta}px`,
    });

    const enter = () => {
      gsap.killTweensOf([circle, label]);

      gsap.to(circle, {
        scale: 1.18,
        duration: 0.55,
        ease: "power3.out",
      });

      gsap.to(label, {
        color:
          primary || active
            ? "#172B36"
            : "#172B36",
        duration: 0.2,
      });
    };

    const leave = () => {
      if (active || primary) return;

      gsap.killTweensOf(circle);

      gsap.to(circle, {
        scale: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(label, {
        color: "#F1F6F4",
        duration: 0.2,
      });
    };

    pill.addEventListener("mouseenter", enter);
    pill.addEventListener("mouseleave", leave);

    return () => {
      pill.removeEventListener(
        "mouseenter",
        enter
      );

      pill.removeEventListener(
        "mouseleave",
        leave
      );
    };
  }, [active, primary]);

  const content = (
    <>
      <span
        ref={circleRef}
        className="nav-pill-circle"
        aria-hidden="true"
      />

      <span
        ref={labelRef}
        className="nav-pill-content"
      >
        {icon && (
          <span className="nav-pill-icon">
            {icon}
          </span>
        )}

        {children}
      </span>
    </>
  );

  const classes = [
    "nav-pill",
    active ? "nav-pill-active" : "",
    primary ? "nav-pill-primary" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link
        href={href}
        ref={pillRef as any}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      ref={pillRef as any}
      onClick={onClick}
      className={classes}
    >
      {content}
    </button>
  );
}