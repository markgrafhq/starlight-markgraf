import { type ReactNode, useEffect, useState } from "react";
import { useMarkgraf, type MarkgrafApi } from "@markgrafhq/markgraf-react";

type Renderer = "canvas" | "svg";
type Theme = "light" | "dark";

export type MarkgrafControls =
  | boolean
  | ((api: MarkgrafApi<Element>) => ReactNode);
const playIcon = (
  <svg viewBox="0 0 15 15" aria-hidden="true" focusable="false">
    <path d="M3.24 2.05a.5.5 0 0 1 .52.02l8.5 5a.5.5 0 0 1 0 .86l-8.5 5A.5.5 0 0 1 3 12.5v-10a.5.5 0 0 1 .24-.45Z" />
  </svg>
);

const pauseIcon = (
  <svg viewBox="0 0 15 15" aria-hidden="true" focusable="false">
    <path d="M3.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5v-10Zm5 0A.5.5 0 0 1 9 2h2a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H9a.5.5 0 0 1-.5-.5v-10Z" />
  </svg>
);

const speedIcon = (
  <svg
    className="markgraf-doc-speed-icon"
    viewBox="0 0 15 15"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3.14 5.64a.5.5 0 0 1 .71 0L7.5 9.29l3.65-3.65a.5.5 0 0 1 .7.71l-4 4a.5.5 0 0 1-.7 0l-4-4a.5.5 0 0 1 0-.71Z" />
  </svg>
);

export interface MarkgrafPlayerProps {
  src: string;
  renderer?: Renderer;
  className?: string;
  /**
   * Shows the transport bar by default. Pass `false` to hide it, or a render
   * function to replace it with controls driven by the same player API.
   */
  controls?: MarkgrafControls;
}

const useDocumentTheme = (): Theme => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = document.documentElement;
    const update = () =>
      setTheme(root.dataset.theme === "dark" ? "dark" : "light");
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
};

const formatTime = (seconds: number): string => {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safe / 60);
  const remainder = safe - minutes * 60;
  return `${minutes}:${remainder.toFixed(1).padStart(4, "0")}`;
};

const DefaultControls = ({
  api,
  speed,
  setSpeed,
}: {
  api: MarkgrafApi<Element>;
  speed: number;
  setSpeed: (speed: number) => void;
}) => {
  const duration = Number.isFinite(api.duration)
    ? Math.max(0, api.duration)
    : 0;
  const time = Number.isFinite(api.time)
    ? Math.max(0, Math.min(api.time, duration))
    : 0;

  return (
    <div
      className="markgraf-doc-controls"
      aria-label="Diagram playback controls"
    >
      <button
        className="markgraf-doc-play"
        type="button"
        aria-label={api.playing ? "Pause diagram" : "Play diagram"}
        aria-pressed={api.playing}
        disabled={!api.ready}
        onClick={api.toggle}
      >
        {api.playing ? pauseIcon : playIcon}
      </button>

      <input
        className="markgraf-doc-scrub"
        type="range"
        aria-label="Diagram time"
        min="0"
        max={Math.max(duration, 0.001)}
        step="0.01"
        value={time}
        disabled={!api.ready}
        onChange={(event) => api.seek(event.currentTarget.valueAsNumber)}
      />

      <output className="markgraf-doc-time" aria-live="off">
        {formatTime(time)} / {formatTime(duration)}
      </output>

      <div className="markgraf-doc-speed-control">
        <select
          className="markgraf-doc-speed"
          aria-label="Playback speed"
          value={speed}
          disabled={!api.ready}
          onChange={(event) => setSpeed(Number(event.currentTarget.value))}
        >
          <option value="0.5">0.5×</option>
          <option value="1">1×</option>
          <option value="1.5">1.5×</option>
          <option value="2">2×</option>
        </select>
        {speedIcon}
      </div>
    </div>
  );
};

const Controls = ({
  api,
  controls,
}: {
  api: MarkgrafApi<Element>;
  controls: MarkgrafControls;
}) => {
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (controls === true && api.ready) api.setSpeed(speed);
  }, [api.ready, controls, speed]);

  if (typeof controls === "function") return controls(api);
  if (!controls) return null;
  return <DefaultControls api={api} speed={speed} setSpeed={setSpeed} />;
};

const CanvasPlayer = ({
  src,
  theme,
  className,
  controls,
}: MarkgrafPlayerProps & { theme: Theme; controls: MarkgrafControls }) => {
  const api = useMarkgraf(src, { renderer: "canvas", theme });

  return (
    <div
      className={`markgraf-doc-player ${className ?? ""}`}
      data-markgraf-theme={theme}
    >
      <canvas
        className="markgraf-player markgraf-doc-stage"
        ref={api.elementRef}
        onClick={api.toggle}
        aria-label="Animated Markgraf diagram"
      />
      <Controls api={api} controls={controls} />
    </div>
  );
};

const SvgPlayer = ({
  src,
  theme,
  className,
  controls,
}: MarkgrafPlayerProps & { theme: Theme; controls: MarkgrafControls }) => {
  const api = useMarkgraf(src, { renderer: "svg", theme });

  return (
    <div
      className={`markgraf-doc-player ${className ?? ""}`}
      data-markgraf-theme={theme}
    >
      <svg
        className="markgraf-player markgraf-doc-stage"
        ref={api.elementRef}
        onClick={api.toggle}
        aria-label="Animated Markgraf diagram"
      />
      <Controls api={api} controls={controls} />
    </div>
  );
};

export const StarlightMarkgrafPlayer = ({
  src,
  renderer = "canvas",
  className,
  controls = true,
}: MarkgrafPlayerProps) => {
  const theme = useDocumentTheme();
  const props = { src, renderer, className, controls, theme };
  return renderer === "svg" ? (
    <SvgPlayer {...props} />
  ) : (
    <CanvasPlayer {...props} />
  );
};
