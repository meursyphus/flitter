export default function FlitterLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16 4L26 16L16 28L6 16Z" fill="#d4d4d4" />
      <path d="M16 7L24 16L16 25L8 16Z" fill="#737373" />
      <path d="M16 10L22 16L16 22L10 16Z" fill="#171717" />
    </svg>
  );
}
