export function Countdown({ value }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center">
      <span className="text-white text-lg font-medium mb-1">
        Capturing photo in
      </span>
      <span className="text-white text-7xl font-bold drop-shadow-xl">
        {value}
      </span>
    </div>
  );
}