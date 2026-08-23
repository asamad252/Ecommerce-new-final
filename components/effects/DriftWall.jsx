"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import "./DriftWall.css";

const subscribeReducedMotion = (callback) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => {
    mq.removeEventListener("change", callback);
  };
};

const getReducedMotionSnapshot = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getReducedMotionServerSnapshot = () => false;

const columnFactor = (index, variance) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const DriftWall = ({
  items = [],

  columns = 4,
  tileWidth = 230,
  tileHeight = 150,
  gap = 18,
  radius = 16,

  tilt = 14,
  turn = -10,
  roll = 0,

  perspective = 1400,
  depth = 100,

  speed = 28,
  direction = "up",
  variance = 0.35,

  parallax = 0.35,
  pauseOnHover = false,

  lift = 45,
  fade = 0.7,
  dim = 0.35,

  grayscale = false,
  overlayColor = "#172B36",

  className = "",
  style = {},
}) => {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const trackRefs = useRef([]);
  const rafRef = useRef(null);

  const offsetsRef = useRef([]);
  const velocitiesRef = useRef([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);

  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });

  const lastTsRef = useRef(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState(null);
  const activeIdRef = useRef(null);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const columnItems = useMemo(() => {
    if (!items.length) return [];

    const cols = Array.from({ length: columns }, () => []);

    items.forEach((item, index) => {
      cols[index % columns].push(item);
    });

    return cols.map((column) =>
      column.length ? column : items.slice(0, 1)
    );
  }, [items, columns]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;

    return columnItems.map((column) => {
      const copyHeight = Math.max(
        unit,
        column.length * unit
      );

      const copies = Math.max(
        2,
        Math.ceil((containerHeight * 1.6) / copyHeight) + 1
      );

      return {
        copyHeight,
        copies,
      };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const directionSign = direction === "up" ? 1 : -1;

    return columnItems.map((_, columnIndex) => {
      const alternateSign =
        columnIndex % 2 === 0 ? 1 : -1;

      return (
        speed *
        columnFactor(columnIndex, variance) *
        directionSign *
        alternateSign
      );
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map(
      (meta, columnIndex) =>
        meta.copyHeight * ((columnIndex * 0.37) % 1)
    );

    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px, py) => {
      const plane = planeRef.current;

      if (!plane) return;

      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) ` +
        `rotateY(${turn + px}deg) ` +
        `rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    const animate = (timestamp) => {
      if (lastTsRef.current === null) {
        lastTsRef.current = timestamp;
      }

      const dt = Math.min(
        0.05,
        Math.max(0, timestamp - lastTsRef.current) / 1000
      );

      lastTsRef.current = timestamp;

      const maxTilt = parallax * 8;

      const targetX =
        pointerRef.current.x * maxTilt;

      const targetY =
        -pointerRef.current.y * maxTilt;

      const damping =
        1 - Math.exp(-dt / 0.12);

      pointerDampedRef.current.x +=
        (targetX - pointerDampedRef.current.x) *
        damping;

      pointerDampedRef.current.y +=
        (targetY - pointerDampedRef.current.y) *
        damping;

      applyPlaneTransform(
        pointerDampedRef.current.x,
        pointerDampedRef.current.y
      );

      if (!reduced) {
        for (
          let columnIndex = 0;
          columnIndex < trackRefs.current.length;
          columnIndex++
        ) {
          const meta = columnMeta[columnIndex];

          if (!meta) continue;

          const paused =
            wallHoveredRef.current &&
            pauseOnHover;

          const factor =
            paused ||
            hoveredColRef.current === columnIndex
              ? 0
              : 1;

          const target =
            baseVelocities[columnIndex] * factor;

          const ease =
            1 -
            Math.exp(
              -dt /
                (target === 0
                  ? 0.16
                  : 0.28)
            );

          velocitiesRef.current[columnIndex] +=
            (target -
              velocitiesRef.current[columnIndex]) *
            ease;

          let next =
            (offsetsRef.current[columnIndex] ?? 0) +
            velocitiesRef.current[columnIndex] * dt;

          next =
            ((next % meta.copyHeight) +
              meta.copyHeight) %
            meta.copyHeight;

          offsetsRef.current[columnIndex] =
            next;

          const element =
            trackRefs.current[columnIndex];

          if (element) {
            element.style.transform =
              `translate3d(0, ${-next}px, 0)`;
          }
        }
      } else {
        for (
          let columnIndex = 0;
          columnIndex < trackRefs.current.length;
          columnIndex++
        ) {
          const element =
            trackRefs.current[columnIndex];

          const meta = columnMeta[columnIndex];

          if (element && meta) {
            element.style.transform =
              `translate3d(0, ${
                -(offsetsRef.current[columnIndex] ?? 0)
              }px, 0)`;
          }
        }
      }

      rafRef.current =
        requestAnimationFrame(animate);
    };

    rafRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [
    baseVelocities,
    columnMeta,
    pauseOnHover,
    parallax,
    reduced,
    applyPlaneTransform,
  ]);

  const activate = useCallback((id, index) => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, []);

  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    (event) => {
      const rect =
        containerRef.current?.getBoundingClientRect();

      if (!rect) return;

      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x:
            (event.clientX - rect.left) /
              rect.width -
            0.5,
          y:
            (event.clientY - rect.top) /
              rect.height -
            0.5,
        };
      }

      const hit = document.elementFromPoint(
        event.clientX,
        event.clientY
      );

      const tile =
        hit && hit.closest
          ? hit.closest("[data-tile-id]")
          : null;

      if (!tile) return;

      const id = tile.dataset.tileId;

      if (id === activeIdRef.current) return;

      activeIdRef.current = id;
      hoveredColRef.current =
        Number(tile.dataset.col);

      setActiveId(id);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false;

    pointerRef.current = {
      x: 0,
      y: 0,
    };

    release();
  }, [release]);

  const cssVars = useMemo(
    () => ({
      "--dw-tile-w": `${tileWidth}px`,
      "--dw-tile-h": `${tileHeight}px`,
      "--dw-gap": `${gap}px`,
      "--dw-radius": `${radius}px`,
      "--dw-perspective": `${perspective}px`,
      "--dw-lift": `${lift}px`,
      "--dw-dim": dim,
      "--dw-gray": grayscale ? 1 : 0,
      "--dw-overlay": overlayColor,
      "--dw-edge": `${Math.max(
        0,
        (1 - fade) * 100
      )}%`,
      ...style,
    }),
    [
      tileWidth,
      tileHeight,
      gap,
      radius,
      perspective,
      lift,
      dim,
      grayscale,
      overlayColor,
      fade,
      style,
    ]
  );

  const renderTile = (
    item,
    id,
    columnIndex
  ) => {
    const inner = (
      <span className="drift-wall__inner">
        <img
          src={item.image}
          alt={item.title ?? ""}
          loading="lazy"
          decoding="async"
          draggable={false}
        />

        <span
          className="drift-wall__overlay"
          aria-hidden="true"
        />
      </span>
    );

    const commonProps = {
      className: `drift-wall__tile${
        activeId === id
          ? " is-active"
          : ""
      }`,
      "data-tile-id": id,
      "data-col": columnIndex,
      onFocus: () =>
        activate(id, columnIndex),
      onBlur: release,
    };

    if (item.href) {
      return (
        <a
          key={id}
          href={item.href}
          {...commonProps}
        >
          {inner}
        </a>
      );
    }

    return (
      <div
        key={id}
        tabIndex={0}
        role="button"
        aria-label={item.title ?? "tile"}
        {...commonProps}
      >
        {inner}
      </div>
    );
  };

  const rootClass = [
    "drift-wall",
    reduced ? "drift-wall--reduced" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="NexGear gaming products"
    >
      <div
        ref={planeRef}
        className="drift-wall__plane"
      >
        {columnItems.map((column, columnIndex) => {
          const meta =
            columnMeta[columnIndex];

          if (!meta) return null;

          const copies = Array.from({
            length: meta.copies,
          });

          return (
            <div
              className="drift-wall__col"
              key={`col-${columnIndex}`}
            >
              <div
                className="drift-wall__track"
                ref={(element) => {
                  trackRefs.current[columnIndex] =
                    element;
                }}
              >
                {copies.map(
                  (_, copyIndex) =>
                    column.map(
                      (item, itemIndex) =>
                        renderTile(
                          item,
                          `${columnIndex}-${copyIndex}-${itemIndex}`,
                          columnIndex
                        )
                    )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriftWall;