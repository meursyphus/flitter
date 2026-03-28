export default function FlitterLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layered widget blocks — representing composition */}
      <rect x="4" y="8" width="16" height="16" rx="3" fill="#0d9488" opacity="0.9" />
      <rect x="10" y="4" width="16" height="16" rx="3" fill="#14b8a6" opacity="0.75" />
      <rect x="14" y="12" width="14" height="14" rx="3" fill="#2dd4bf" opacity="0.6" />
    </svg>
  );
}
