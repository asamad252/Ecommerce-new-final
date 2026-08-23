"use client";


import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
  type OGLRenderingContext,
} from "ogl";
import { useEffect, useRef } from "react";

import "./CircularGallery.css";

type GalleryItem = {
  image: string;
  text: string;
};

type CircularGalleryProps = {
  items?: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  fontUrl?: string;
  scrollSpeed?: number;
  scrollEase?: number;
};

type ScreenSize = {
  width: number;
  height: number;
};

type ViewportSize = {
  width: number;
  height: number;
};

type ScrollState = {
  ease: number;
  current: number;
  target: number;
  last: number;
  position?: number;
};

type FontDescriptors = {
  weight?: string;
  style?: string;
  unicodeRange?: string;
};

type TextTextureResult = {
  texture: Texture;
  width: number;
  height: number;
};

type MediaConstructorOptions = {
  geometry: Plane;
  gl: OGLRenderingContext;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  viewport: ViewportSize;
  bend: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
};

type AppOptions = {
  items?: GalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
};

const DEFAULT_FONT = "bold 30px Figtree";

const DEFAULT_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Figtree:wght@400;700&display=swap";

function debounce(
  func: (...args: unknown[]) => void,
  wait: number
): (...args: unknown[]) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: unknown[]) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

function lerp(
  p1: number,
  p2: number,
  t: number
): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: object): void {
  const proto = Object.getPrototypeOf(instance);

  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key === "constructor") return;

    const value = (instance as Record<string, unknown>)[key];

    if (typeof value === "function") {
      (
        instance as Record<string, unknown>
      )[key] = (
        value as (...args: unknown[]) => unknown
      ).bind(instance);
    }
  });
}

function deriveFontFamilyFromUrl(
  url: string
): string {
  const fileName =
    (url.split("/").pop() || "custom-font").split("?")[0];

  const base = fileName.replace(
    /\.(woff2?|ttf|otf|eot)$/i,
    ""
  );

  return (
    base.replace(/[^a-zA-Z0-9-_ ]/g, "").trim() ||
    "CircularGalleryFont"
  );
}

async function loadFontFromStylesheet(
  url: string
): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch font stylesheet (${response.status})`
    );
  }

  const cssText = await response.text();

  const faceBlocks =
    cssText.match(/@font-face\s*{[^}]*}/g) || [];

  let family: string | null = null;

  const fontFaces: FontFace[] = [];

  for (const block of faceBlocks) {
    const familyMatch = block.match(
      /font-family:\s*['"]?([^;'"]+)['"]?/
    );

    const urlMatch = block.match(
      /url\(\s*['"]?([^'")]+)['"]?\s*\)/
    );

    if (!familyMatch || !urlMatch) {
      continue;
    }

    family = familyMatch[1].trim();

    const descriptors: FontDescriptors = {};

    const weightMatch = block.match(
      /font-weight:\s*([^;]+);/
    );

    const styleMatch = block.match(
      /font-style:\s*([^;]+);/
    );

    const rangeMatch = block.match(
      /unicode-range:\s*([^;]+);/
    );

    if (weightMatch) {
      descriptors.weight = weightMatch[1].trim();
    }

    if (styleMatch) {
      descriptors.style = styleMatch[1].trim();
    }

    if (rangeMatch) {
      descriptors.unicodeRange =
        rangeMatch[1].trim();
    }

    fontFaces.push(
      new FontFace(
        family,
        `url(${urlMatch[1]})`,
        descriptors as FontFaceDescriptors
      )
    );
  }

  if (!family) {
    throw new Error(
      "No @font-face rule found in the stylesheet"
    );
  }

  await Promise.allSettled(
    fontFaces.map(async (face) => {
      await face.load();
      document.fonts.add(face);
    })
  );

  return family;
}

async function loadFontFromFile(
  url: string
): Promise<string> {
  const family =
    deriveFontFamilyFromUrl(url);

  const fontFace = new FontFace(
    family,
    `url(${url})`
  );

  await fontFace.load();

  document.fonts.add(fontFace);

  return family;
}

async function loadCustomFont(
  fontUrl: string
): Promise<string> {
  const isStylesheet =
    fontUrl.includes("fonts.googleapis.com") ||
    /\.css(\?.*)?$/i.test(fontUrl);

  return isStylesheet
    ? loadFontFromStylesheet(fontUrl)
    : loadFontFromFile(fontUrl);
}

async function resolveFont(
  font: string,
  fontUrl?: string
): Promise<string> {
  const effectiveUrl =
    fontUrl ||
    (font === DEFAULT_FONT
      ? DEFAULT_FONT_URL
      : null);

  if (!effectiveUrl) {
    if (
      document.fonts &&
      document.fonts.load
    ) {
      try {
        await document.fonts.load(font);
        await document.fonts.ready;
      } catch {
        // Ignore font loading errors.
      }
    }

    return font;
  }

  try {
    const family =
      await loadCustomFont(effectiveUrl);

    const sizeMatch = font.match(
      /^\s*(.*?\d+px)/
    );

    const prefix = sizeMatch
      ? sizeMatch[1].trim()
      : "bold 30px";

    const resolved =
      `${prefix} "${family}"`;

    if (
      document.fonts &&
      document.fonts.load
    ) {
      try {
        await document.fonts.load(
          resolved
        );
      } catch {
        // Ignore font loading errors.
      }
    }

    return resolved;
  } catch (error) {
    console.error(
      "CircularGallery: unable to load font from",
      fontUrl,
      error
    );

    return font;
  }
}

function getFontSize(
  font: string
): number {
  const match = font.match(
    /(\d+)px/
  );

  return match
    ? parseInt(match[1], 10)
    : 30;
}

function createTextTexture(
  gl: OGLRenderingContext,
  text: string,
  font = "bold 30px monospace",
  color = "black"
): TextTextureResult {
  const canvas =
    document.createElement("canvas");

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Unable to create 2D canvas context."
    );
  }

  context.font = font;

  const metrics =
    context.measureText(text);

  const textWidth =
    Math.ceil(metrics.width);

  const textHeight =
    Math.ceil(
      getFontSize(font) * 1.2
    );

  canvas.width =
    textWidth + 20;

  canvas.height =
    textHeight + 20;

  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.fillText(
    text,
    canvas.width / 2,
    canvas.height / 2
  );

  const texture = new Texture(gl, {
    generateMipmaps: false,
  });

  texture.image = canvas;

  return {
    texture,
    width: canvas.width,
    height: canvas.height,
  };
}

class Title {
  private gl: OGLRenderingContext;
  private plane: Mesh;
  private renderer: Renderer;
  private text: string;
  private textColor: string;
  private font: string;
  private mesh!: Mesh;

  constructor({
    gl,
    plane,
    renderer,
    text,
    textColor = "#545050",
    font = "30px sans-serif",
  }: {
    gl: OGLRenderingContext;
    plane: Mesh;
    renderer: Renderer;
    text: string;
    textColor?: string;
    font?: string;
  }) {
    autoBind(this);

    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;

    this.createMesh();
  }

  createMesh(): void {
    const {
      texture,
      width,
      height,
    } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor
    );

    const geometry =
      new Plane(this.gl);

    const program =
      new Program(this.gl, {
        vertex: `
          attribute vec3 position;
          attribute vec2 uv;

          uniform mat4 modelViewMatrix;
          uniform mat4 projectionMatrix;

          varying vec2 vUv;

          void main() {
            vUv = uv;

            gl_Position =
              projectionMatrix *
              modelViewMatrix *
              vec4(position, 1.0);
          }
        `,

        fragment: `
          precision highp float;

          uniform sampler2D tMap;

          varying vec2 vUv;

          void main() {
            vec4 color =
              texture2D(tMap, vUv);

            if (color.a < 0.1) discard;

            gl_FragColor = color;
          }
        `,

        uniforms: {
          tMap: {
            value: texture,
          },
        },

        transparent: true,
      });

    this.mesh = new Mesh(
      this.gl,
      {
        geometry,
        program,
      }
    );

    const aspect =
      width / height;

    const textHeight =
      this.plane.scale.y * 0.15;

    const textWidth =
      textHeight * aspect;

    this.mesh.scale.set(
      textWidth,
      textHeight,
      1
    );

    this.mesh.position.y =
      -this.plane.scale.y * 0.5 -
      textHeight * 0.5 -
      0.05;

    this.mesh.setParent(
      this.plane
    );
  }
}

class Media {
  private geometry: Plane;
  private gl: OGLRenderingContext;
  private image: string;
  private index: number;
  private length: number;
  private renderer: Renderer;
  private scene: Transform;
  private screen: ScreenSize;
  private text: string;
  private viewport: ViewportSize;
  private bend: number;
  private textColor?: string;
  private borderRadius: number;
  private font?: string;

  private extra = 0;

  private program!: Program;
  private plane!: Mesh;
  private title!: Title;

  private scale = 0;
  private padding = 0;
  public width = 0;
  private widthTotal = 0;
  private x = 0;
  private speed = 0;

  private isBefore = false;
  private isAfter = false;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
  }: MediaConstructorOptions) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;

    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader(): void {
    const texture =
      new Texture(this.gl, {
        generateMipmaps: true,
      });

    this.program =
      new Program(this.gl, {
        depthTest: false,
        depthWrite: false,

        vertex: `
          precision highp float;

          attribute vec3 position;
          attribute vec2 uv;

          uniform mat4 modelViewMatrix;
          uniform mat4 projectionMatrix;

          uniform float uTime;
          uniform float uSpeed;

          varying vec2 vUv;

          void main() {
            vUv = uv;

            vec3 p = position;

            p.z =
              (
                sin(
                  p.x * 4.0 +
                  uTime
                ) * 1.5 +

                cos(
                  p.y * 2.0 +
                  uTime
                ) * 1.5
              )
              *
              (0.1 +
              uSpeed * 0.5);

            gl_Position =
              projectionMatrix *
              modelViewMatrix *
              vec4(p, 1.0);
          }
        `,

        fragment: `
          precision highp float;

          uniform vec2 uImageSizes;
          uniform vec2 uPlaneSizes;

          uniform sampler2D tMap;

          uniform float uBorderRadius;

          varying vec2 vUv;

          float roundedBoxSDF(
            vec2 p,
            vec2 b,
            float r
          ) {
            vec2 d =
              abs(p) - b;

            return length(
              max(
                d,
                vec2(0.0)
              )
            )
            +
            min(
              max(
                d.x,
                d.y
              ),
              0.0
            )
            - r;
          }

          void main() {
            vec2 ratio = vec2(
              min(
                (
                  uPlaneSizes.x /
                  uPlaneSizes.y
                ) /
                (
                  uImageSizes.x /
                  uImageSizes.y
                ),
                1.0
              ),

              min(
                (
                  uPlaneSizes.y /
                  uPlaneSizes.x
                ) /
                (
                  uImageSizes.y /
                  uImageSizes.x
                ),
                1.0
              )
            );

            vec2 uv = vec2(
              vUv.x * ratio.x +
                (1.0 - ratio.x) *
                0.5,

              vUv.y * ratio.y +
                (1.0 - ratio.y) *
                0.5
            );

            vec4 color =
              texture2D(
                tMap,
                uv
              );

            float d =
              roundedBoxSDF(
                vUv - 0.5,
                vec2(
                  0.5 -
                  uBorderRadius
                ),
                uBorderRadius
              );

            float edgeSmooth =
              0.002;

            float alpha =
              1.0 -
              smoothstep(
                -edgeSmooth,
                edgeSmooth,
                d
              );

            gl_FragColor =
              vec4(
                color.rgb,
                alpha
              );
          }
        `,

        uniforms: {
          tMap: {
            value: texture,
          },

          uPlaneSizes: {
            value: [0, 0],
          },

          uImageSizes: {
            value: [0, 0],
          },

          uSpeed: {
            value: 0,
          },

          uTime: {
            value:
              100 * Math.random(),
          },

          uBorderRadius: {
            value:
              this.borderRadius,
          },
        },

        transparent: true,
      });

    const img =
      new Image();

    img.crossOrigin =
      "anonymous";

    img.src =
      this.image;

    img.onload = () => {
      texture.image = img;

      this.program.uniforms.uImageSizes.value =
        [
          img.naturalWidth,
          img.naturalHeight,
        ];
    };
  }

  createMesh(): void {
    this.plane =
      new Mesh(this.gl, {
        geometry:
          this.geometry,
        program:
          this.program,
      });

    this.plane.setParent(
      this.scene
    );
  }

  createTitle(): void {
    this.title =
      new Title({
        gl: this.gl,
        plane: this.plane,
        renderer:
          this.renderer,
        text: this.text,
        textColor:
          this.textColor,
        font: this.font,
      });
  }

  update(
    scroll: ScrollState,
    direction: "left" | "right"
  ): void {
    this.plane.position.x =
      this.x -
      scroll.current -
      this.extra;

    const x =
      this.plane.position.x;

    const H =
      this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y =
        0;

      this.plane.rotation.z =
        0;
    } else {
      const B_abs =
        Math.abs(this.bend);

      const R =
        (H * H +
          B_abs * B_abs) /
        (2 * B_abs);

      const effectiveX =
        Math.min(
          Math.abs(x),
          H
        );

      const arc =
        R -
        Math.sqrt(
          R * R -
            effectiveX *
              effectiveX
        );

      if (this.bend > 0) {
        this.plane.position.y =
          -arc;

        this.plane.rotation.z =
          -Math.sign(x) *
          Math.asin(
            effectiveX / R
          );
      } else {
        this.plane.position.y =
          arc;

        this.plane.rotation.z =
          Math.sign(x) *
          Math.asin(
            effectiveX / R
          );
      }
    }

    this.speed =
      scroll.current -
      scroll.last;

    this.program.uniforms.uTime.value +=
      0.04;

    this.program.uniforms.uSpeed.value =
      this.speed;

    const planeOffset =
      this.plane.scale.x / 2;

    const viewportOffset =
      this.viewport.width / 2;

    this.isBefore =
      this.plane.position.x +
        planeOffset <
      -viewportOffset;

    this.isAfter =
      this.plane.position.x -
        planeOffset >
      viewportOffset;

    if (
      direction === "right" &&
      this.isBefore
    ) {
      this.extra -=
        this.widthTotal;

      this.isBefore =
        false;

      this.isAfter =
        false;
    }

    if (
      direction === "left" &&
      this.isAfter
    ) {
      this.extra +=
        this.widthTotal;

      this.isBefore =
        false;

      this.isAfter =
        false;
    }
  }

  onResize({
    screen,
    viewport,
  }: {
    screen?: ScreenSize;
    viewport?: ViewportSize;
  } = {}): void {
    if (screen) {
      this.screen = screen;
    }

    if (viewport) {
      this.viewport =
        viewport;

      const uniforms =
        this.plane?.program
          ?.uniforms as Record<
          string,
          {
            value: unknown;
          }
        >;

      if (
        uniforms?.uViewportSizes
      ) {
        uniforms.uViewportSizes.value =
          [
            this.viewport.width,
            this.viewport.height,
          ];
      }
    }

    this.scale =
      this.screen.height /
      1500;

    // Keep gallery cards at the same 4:3 aspect ratio as the
    // default 800x600 images instead of forcing them into 7:9.
    // This prevents unnecessary cropping and makes the image
    // dimensions consistent across screen sizes.
    const CARD_WIDTH = 800;
    const CARD_HEIGHT = 600;

    this.plane.scale.y =
      (this.viewport.height *
        (CARD_HEIGHT * this.scale)) /
      this.screen.height;

    this.plane.scale.x =
      (this.viewport.width *
        (CARD_WIDTH * this.scale)) /
      this.screen.width;

    this.program.uniforms.uPlaneSizes.value =
      [
        this.plane.scale.x,
        this.plane.scale.y,
      ];

    this.padding = 2;

    this.width =
      this.plane.scale.x +
      this.padding;

    this.widthTotal =
      this.width *
      this.length;

    this.x =
      this.width *
      this.index;
  }
}

class App {
  private container: HTMLDivElement;
  private scrollSpeed: number;
  private scroll: ScrollState;

  private onCheckDebounce: () => void;

  private renderer!: Renderer;
  private gl!: OGLRenderingContext;
  private camera!: Camera;
  private scene!: Transform;
  private planeGeometry!: Plane;

  private screen!: ScreenSize;
  private viewport!: ViewportSize;

  private medias: Media[] = [];

  private raf = 0;

  private isDown = false;
  private start = 0;

  private boundOnResize!: () => void;
  private boundOnWheel!: (
    event: WheelEvent
  ) => void;
  private boundOnTouchDown!: (
    event:
      | MouseEvent
      | TouchEvent
  ) => void;
  private boundOnTouchMove!: (
    event:
      | MouseEvent
      | TouchEvent
  ) => void;
  private boundOnTouchUp!: () => void;
  private boundOnKeyDown!: (
    event: KeyboardEvent
  ) => void;

  constructor(
    container: HTMLDivElement,
    {
      items,
      bend,
      textColor = "#ffffff",
      borderRadius = 0,
      font = DEFAULT_FONT,
      scrollSpeed = 2,
      scrollEase = 0.05,
    }: AppOptions = {}
  ) {
    document.documentElement.classList.remove(
      "no-js"
    );

    this.container =
      container;

    this.scrollSpeed =
      scrollSpeed;

    this.scroll = {
      ease: scrollEase,
      current: 0,
      target: 0,
      last: 0,
    };

    this.onCheckDebounce =
      (() => {
        let timeout:
          | ReturnType<
              typeof setTimeout
            >
          | undefined;

        return () => {
          if (timeout) {
            clearTimeout(timeout);
          }

          timeout =
            setTimeout(() => {
              this.onCheck();
            }, 200);
        };
      })();

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();

    this.createMedias(
      items,
      bend,
      textColor,
      borderRadius,
      font
    );

    this.update();
    this.addEventListeners();
  }

  createRenderer(): void {
    this.renderer =
      new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(
          window.devicePixelRatio ||
            1,
          2
        ),
      });

    this.gl =
      this.renderer.gl;

    this.gl.clearColor(
      0,
      0,
      0,
      0
    );

    if (this.gl.canvas instanceof HTMLCanvasElement) {
      this.container.appendChild(
        this.gl.canvas
      );
    }
  }

  createCamera(): void {
    this.camera =
      new Camera(this.gl);

    this.camera.fov = 45;

    this.camera.position.z =
      20;
  }

  createScene(): void {
    this.scene =
      new Transform();
  }

  createGeometry(): void {
    this.planeGeometry =
      new Plane(this.gl, {
        heightSegments: 50,
        widthSegments: 100,
      });
  }

  createMedias(
    items: GalleryItem[] | undefined,
    bend = 1,
    textColor?: string,
    borderRadius = 0,
    font = DEFAULT_FONT
  ): void {
    const defaultItems: GalleryItem[] =
      [
        {
          image:
            "https://picsum.photos/seed/1/800/600?grayscale",
          text: "Bridge",
        },
        {
          image:
            "https://picsum.photos/seed/2/800/600?grayscale",
          text: "Desk Setup",
        },
        {
          image:
            "https://picsum.photos/seed/3/800/600?grayscale",
          text: "Waterfall",
        },
        {
          image:
            "https://picsum.photos/seed/4/800/600?grayscale",
          text: "Strawberries",
        },
        {
          image:
            "https://picsum.photos/seed/5/800/600?grayscale",
          text: "Deep Diving",
        },
      ];

    const galleryItems =
      items && items.length
        ? items
        : defaultItems;

    const mediasImages =
      galleryItems.concat(
        galleryItems
      );

    this.medias =
      mediasImages.map(
        (data, index) =>
          new Media({
            geometry:
              this.planeGeometry,
            gl: this.gl,
            image: data.image,
            index,
            length:
              mediasImages.length,
            renderer:
              this.renderer,
            scene:
              this.scene,
            screen:
              this.screen,
            text: data.text,
            viewport:
              this.viewport,
            bend,
            textColor,
            borderRadius,
            font,
          })
      );
  }

  onTouchDown(
    e: MouseEvent | TouchEvent
  ): void {
    this.isDown = true;

    this.scroll.position =
      this.scroll.current;

    if ("touches" in e) {
      this.start =
        e.touches[0]?.clientX ??
        0;
    } else {
      this.start =
        e.clientX;
    }
  }

  onTouchMove(
    e: MouseEvent | TouchEvent
  ): void {
    if (!this.isDown) {
      return;
    }

    const x =
      "touches" in e
        ? e.touches[0]?.clientX ??
          0
        : e.clientX;

    const distance =
      (this.start - x) *
      (this.scrollSpeed *
        0.025);

    this.scroll.target =
      (this.scroll.position ??
        this.scroll.current) +
      distance;
  }

  onTouchUp(): void {
    this.isDown = false;

    this.onCheck();
  }

  onWheel(
    e: WheelEvent
  ): void {
    const delta =
      e.deltaY;

    this.scroll.target +=
      (delta > 0
        ? this.scrollSpeed
        : -this.scrollSpeed) *
      0.2;

    this.onCheckDebounce();
  }

  onKeyDown(
    e: KeyboardEvent
  ): void {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();

        this.scroll.target +=
          this.scrollSpeed * 5;

        this.onCheckDebounce();

        break;

      case "ArrowLeft":
        e.preventDefault();

        this.scroll.target -=
          this.scrollSpeed * 5;

        this.onCheckDebounce();

        break;

      case "Home":
        e.preventDefault();

        this.scroll.target = 0;

        this.onCheckDebounce();

        break;

      default:
        break;
    }
  }

  onCheck(): void {
    if (
      !this.medias ||
      !this.medias[0]
    ) {
      return;
    }

    const width =
      this.medias[0].width;

    const itemIndex =
      Math.round(
        Math.abs(
          this.scroll.target
        ) / width
      );

    const item =
      width * itemIndex;

    this.scroll.target =
      this.scroll.target < 0
        ? -item
        : item;
  }

  onResize(): void {
    this.screen = {
      width:
        this.container
          .clientWidth,
      height:
        this.container
          .clientHeight,
    };

    this.renderer?.setSize(
      this.screen.width,
      this.screen.height
    );

    if (!this.camera) {
      return;
    }

    this.camera.perspective({
      aspect:
        this.screen.width /
        this.screen.height,
    });

    const fov =
      (this.camera.fov *
        Math.PI) /
      180;

    const height =
      2 *
      Math.tan(fov / 2) *
      this.camera
        .position.z;

    const width =
      height *
      this.camera.aspect;

    this.viewport = {
      width,
      height,
    };

    if (this.medias) {
      this.medias.forEach(
        (media) =>
          media.onResize({
            screen:
              this.screen,
            viewport:
              this.viewport,
          })
      );
    }
  }

  update(): void {
    this.scroll.current =
      lerp(
        this.scroll.current,
        this.scroll.target,
        this.scroll.ease
      );

    const direction:
      | "right"
      | "left" =
      this.scroll.current >
      this.scroll.last
        ? "right"
        : "left";

    this.medias.forEach(
      (media) =>
        media.update(
          this.scroll,
          direction
        )
    );

    this.renderer.render({
      scene: this.scene,
      camera: this.camera,
    });

    this.scroll.last =
      this.scroll.current;

    this.raf =
      window.requestAnimationFrame(
        () => this.update()
      );
  }

  addEventListeners(): void {
    this.boundOnResize =
      () => this.onResize();

    this.boundOnWheel =
      (event) =>
        this.onWheel(event);

    this.boundOnTouchDown =
      (event) =>
        this.onTouchDown(event);

    this.boundOnTouchMove =
      (event) =>
        this.onTouchMove(event);

    this.boundOnTouchUp =
      () => this.onTouchUp();

    this.boundOnKeyDown =
      (event) =>
        this.onKeyDown(event);

    window.addEventListener(
      "resize",
      this.boundOnResize
    );

    window.addEventListener(
      "wheel",
      this.boundOnWheel
    );

    window.addEventListener(
      "mousedown",
      this.boundOnTouchDown
    );

    window.addEventListener(
      "mousemove",
      this.boundOnTouchMove
    );

    window.addEventListener(
      "mouseup",
      this.boundOnTouchUp
    );

    window.addEventListener(
      "touchstart",
      this.boundOnTouchDown,
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      this.boundOnTouchMove,
      { passive: true }
    );

    window.addEventListener(
      "touchend",
      this.boundOnTouchUp
    );

    this.container.addEventListener(
      "keydown",
      this.boundOnKeyDown
    );
  }

  destroy(): void {
    window.cancelAnimationFrame(
      this.raf
    );

    window.removeEventListener(
      "resize",
      this.boundOnResize
    );

    window.removeEventListener(
      "wheel",
      this.boundOnWheel
    );

    window.removeEventListener(
      "mousedown",
      this.boundOnTouchDown
    );

    window.removeEventListener(
      "mousemove",
      this.boundOnTouchMove
    );

    window.removeEventListener(
      "mouseup",
      this.boundOnTouchUp
    );

    window.removeEventListener(
      "touchstart",
      this.boundOnTouchDown
    );

    window.removeEventListener(
      "touchmove",
      this.boundOnTouchMove
    );

    window.removeEventListener(
      "touchend",
      this.boundOnTouchUp
    );

    if (
      this.renderer &&
      this.renderer.gl &&
      this.renderer.gl.canvas
        .parentNode
    ) {
      this.renderer.gl.canvas.parentNode.removeChild(
        this.renderer.gl.canvas
      );
    }

    this.container.removeEventListener(
      "keydown",
      this.boundOnKeyDown
    );
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = DEFAULT_FONT,
  fontUrl,
  scrollSpeed = 2,
  scrollEase = 0.05,
}: CircularGalleryProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let app: App | undefined;
    let isMounted = true;

    resolveFont(
      font,
      fontUrl
    ).then((resolvedFont) => {
      if (
        !isMounted ||
        !containerRef.current
      ) {
        return;
      }

      app = new App(
        containerRef.current,
        {
          items,
          bend,
          textColor,
          borderRadius,
          font: resolvedFont,
          scrollSpeed,
          scrollEase,
        }
      );
    });

    return () => {
      isMounted = false;

      if (app) {
        app.destroy();
      }
    };
  }, [
    items,
    bend,
    textColor,
    borderRadius,
    font,
    fontUrl,
    scrollSpeed,
    scrollEase,
  ]);

  return (
    <div
      className="circular-gallery"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Circular image gallery. Use left and right arrow keys to navigate."
    />
  );
}