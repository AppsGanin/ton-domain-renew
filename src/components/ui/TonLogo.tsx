interface Props {
  size?: number;
  className?: string;
}

// Tight bounding box of the mark. The source icon sits inside a 0 0 24 24
// viewBox with lots of empty space around it; cropping to the glyph's real
// bounds makes the logo render flush, with no padding. `size` is the width;
// height follows the glyph's aspect ratio so nothing is letterboxed.
const VIEW_BOX = '4.71 6.42 14.58 12.9';
const ASPECT = 14.58 / 12.9;

export function TonLogo({ size = 40, className }: Props) {
  return (
    <svg
      width={size}
      height={size / ASPECT}
      viewBox={VIEW_BOX}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="#0098EA"
        d="M19.011 9.201L12.66 19.316a.857.857 0 0 1-1.453-.005L4.98 9.197a1.8 1.8 0 0 1-.266-.943a1.856 1.856 0 0 1 1.881-1.826h10.817c1.033 0 1.873.815 1.873 1.822c0 .334-.094.664-.274.951M6.51 8.863l4.632 7.144V8.143H6.994c-.48 0-.694.317-.484.72m6.347 7.144l4.633-7.144c.214-.403-.005-.72-.485-.72h-4.148z"
      />
    </svg>
  );
}
