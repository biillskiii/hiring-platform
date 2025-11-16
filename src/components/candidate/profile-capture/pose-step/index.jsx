export default function PoseStep({ step, active, img }) {
  return (
    <div className="relative">
      <div className="w-fit h-fit rounded-lg border flex items-center justify-center overflow-hidden bg-neutral-10 border-neutral-300">
        <img
          src={img}
          alt={`pose-${step}`}
          className="w-full h-full object-contain p-2"
        />
      </div>

      {active && (
        <div className="absolute -top-1 -right-1 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-green-500 drop-shadow-lg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
