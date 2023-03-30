import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { spotifyApi } from "../_app";
import { formatTime } from "@/utils/formatTime";
import { Clock, PlayCircle } from "react-feather";
import { accessUrl } from "@/config";

export default function Playlist() {
    const router = useRouter();
    const {
        data: playlist,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["playlists", router.query.id],
        queryFn: async () =>
            (await spotifyApi.getPlaylist(router.query.id)).body,
    });

    if (isLoading) return <Layout>loading...</Layout>;
    if (isError)
        return (
            <Layout>
                <div className="">
                    <h3>Please log in again</h3>
                    <a
                        href={accessUrl}
                        className="rounded-xl bg-primary py-1.5 px-5 text-xl"
                    >
                        Sign in
                    </a>
                </div>
            </Layout>
        );

    return (
        <Layout>
            <div className="flex items-end gap-3 bg-gradient-to-b from-primary/70 to-bg-dimmed p-10">
                <img
                    src={playlist.images[0]?.url}
                    alt="playlist image"
                    className="h-28 w-28 flex-shrink-0 md:h-60 md:w-60"
                />
                <div>
                    <p className="text-sm tracking-widest text-text">
                        PLAYLIST
                    </p>
                    <h2 className="text-3xl font-black md:text-4xl">
                        {playlist.name}
                    </h2>
                </div>
            </div>
            <div className="p-4 md:p-10">
                <div className="w-full text-text-dimmed">
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 text-sm md:grid-cols-[auto_1fr_1fr_auto]">
                        <div className="w-8">#</div>
                        <div>TITLE</div>
                        <div className="max-md:hidden">ALBUM</div>
                        <div>
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>

                    <hr className="my-3 border-text-dimmed/40" />
                    {playlist.tracks.items.map((item, index) => (
                        <div
                            key={item.id}
                            className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md py-1.5 px-6 text-sm hover:bg-text-dimmed/10 md:grid-cols-[auto_1fr_1fr_auto]"
                        >
                            <div className="w-8 text-base">
                                <p className="group-hover:hidden">
                                    {index + 1}
                                </p>
                                <PlayCircle className="h-5.5 w-5.5 hidden text-text group-hover:block" />
                            </div>

                            <div className="flex items-center gap-4 overflow-hidden">
                                <img
                                    src={item.track.album.images[0].url}
                                    alt=""
                                    className="h-12 w-12"
                                />
                                <div className="overflow-hidden">
                                    <h4 className=" truncate text-text">
                                        {item.track.name}
                                    </h4>
                                    <p className="truncate">
                                        {item.track.artists[0].name}
                                    </p>
                                </div>
                            </div>

                            <div className="truncate max-md:hidden">
                                {item.track.album.name}
                            </div>
                            <div>{formatTime(item.track.duration_ms)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
