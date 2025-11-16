export default function Header({ onClose }) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-xl font-semibold">Raise Your Hand to Capture</h2>
        <p className="text-sm text-neutral-600">
          We'll take the photo once your hand pose is detected.
        </p>
      </div>

      <button onClick={onClose} className="text-neutral-500 text-xl">
        ✕
      </button>
    </div>
  );
}
