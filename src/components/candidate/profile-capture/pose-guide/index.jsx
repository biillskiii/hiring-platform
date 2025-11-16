import PoseStep from "../pose-step";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function PoseGuide({ poseDone }) {
  return (
    <div className="mt-5 text-center text-neutral-800">
      <p>To take a picture, follow the hand poses in order below.</p>

      <div className="flex items-center justify-center gap-6 mt-5">
        <PoseStep step={1} active={poseDone[1]} img="/assets/pose2.svg" />
        <ArrowRightIcon width={15}/>
        <PoseStep step={2} active={poseDone[2]} img="/assets/pose1.svg" />
        <ArrowRightIcon width={15}/>
        <PoseStep step={3} active={poseDone[3]} img="/assets/pose3.svg" />
      </div>
    </div>
  );
}
