export default function FlitterLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="10" r="9" fill="#171717" opacity="0.28" />
      <circle cx="10" cy="20" r="9" fill="#171717" opacity="0.28" />
      <circle cx="22" cy="20" r="9" fill="#171717" opacity="0.28" />
    </svg>
  );
}
