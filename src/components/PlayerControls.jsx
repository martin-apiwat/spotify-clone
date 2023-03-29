import { Play, Pause, SkipBack, SkipForward } from "react-feather";

export default function PlayerControls({ player }) {
    return (
        <div>
            <div className="flex items-center justify-center gap-4">
                <SkipBack className="h-5 w-5 fill-white" />
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-text">
                    <Play
                        className="ml-1 h-5 w-5 fill-black text-black"
                        onClick={() => {
                            player.togglePlay();
                        }}
                    />
                </div>
                <SkipForward className="h-5 w-5 fill-white" />
            </div>
        </div>
    );
}
