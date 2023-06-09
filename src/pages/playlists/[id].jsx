import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { spotifyApi } from "../_app";
import { formatTime } from "@/utils/formatTime";
import { Clock, PlayCircle } from "react-feather";
import { accessUrl } from "@/config";
import Link from "next/link";
import { useState } from "react";

export default function Playlist() {
   const router = useRouter();
   const {
      data: playlist,
      isLoading,
      isError,
   } = useQuery({
      queryKey: ["playlists", router.query.id],
      queryFn: async () => (await spotifyApi.getPlaylist(router.query.id)).body,
   });

   const [currentTrack, setCurrentTrack] = useState(null);
   console.log("the current track is", currentTrack);

   if (isError)
      return (
         <Layout>
            <h2 className="px-4 py-16 text-center text-3xl font-bold md:text-5xl">
               Oops, could not get that playlist
            </h2>
            <div className="flex justify-center">
               <Link href="/" className="rounded-full bg-primary py-4 px-6">
                  Go back
               </Link>
            </div>
         </Layout>
      );

   return (
      <Layout setCurrentTrack={setCurrentTrack}>
         <div className="flex items-end gap-3 bg-gradient-to-b from-primary/70 to-bg-dimmed p-10">
            {isLoading ? (
               <div className="h-28 w-28 flex-shrink-0 animate-pulse  bg-neutral-600 md:h-60 md:w-60"></div>
            ) : (
               <img
                  src={playlist.images[0]?.url}
                  alt="playlist image"
                  className="h-28 w-28 flex-shrink-0 md:h-60 md:w-60"
               />
            )}

            <div>
               <p className="text-sm tracking-widest text-text">PLAYLIST</p>
               {isLoading ? (
                  <div className="animate-pulse bg-neutral-600 text-3xl font-black text-transparent md:text-4xl">
                     this is a playlist
                  </div>
               ) : (
                  <h2 className="text-3xl font-black md:text-4xl">
                     {playlist.name}
                  </h2>
               )}
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
               {isLoading
                  ? Array(20)
                       .fill(null)
                       .map((_, index) => (
                          <div
                             key={index}
                             className=" grid animate-pulse grid-cols-[auto_1fr_auto] items-center gap-4  py-1.5 px-6 text-sm md:grid-cols-[auto_1fr_1fr_auto]"
                          >
                             <div className="w-8">
                                <div className="h-4 w-4 bg-neutral-600"></div>
                             </div>
                             <div className="flex gap-4">
                                <div className="h-12 w-12 flex-shrink-0 bg-neutral-600"></div>
                                <div className="w-full">
                                   <div className="mb-2 h-6 w-4/6 rounded-full bg-neutral-600"></div>
                                   <div className="h-4 w-2/6 rounded-full bg-neutral-600"></div>
                                </div>
                             </div>
                             <div className="h-6 w-2/6 rounded-full bg-neutral-600 max-md:hidden"></div>
                             <div className="h-6 w-10 rounded-lg bg-neutral-600"></div>
                          </div>
                       ))
                  : playlist.tracks.items.map((item, index) => (
                       <div
                          key={item.id}
                          className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md py-1.5 px-6 text-sm hover:bg-text-dimmed/10 md:grid-cols-[auto_1fr_1fr_auto]"
                          onClick={async () => {
                             await spotifyApi.play({
                                context_uri: `spotify:playlist:${router.query.id}`,
                                offset: {
                                   position: index,
                                },
                             });
                          }}
                       >
                          <div className="w-8 text-base">
                             {item.track.id === currentTrack?.id ? (
                                <div className="">
                                   <PlayCircle className="text-primary" />
                                </div>
                             ) : (
                                <>
                                   <p className="group-hover:hidden">
                                      {index + 1}
                                   </p>
                                   <PlayCircle className="h-5.5 w-5.5 hidden cursor-pointer text-text group-hover:block" />
                                </>
                             )}
                          </div>

                          <div className="flex items-center gap-4 overflow-hidden">
                             <img
                                src={item.track.album.images[0].url}
                                alt=""
                                className="h-12 w-12"
                             />
                             {item.track.id === currentTrack?.id ? (
                                <div className="truncate text-primary">
                                   {item.track.name}
                                   <p className="truncate text-text-dimmed">
                                      {item.track.artists[0].name}
                                   </p>
                                </div>
                             ) : (
                                <div className="overflow-hidden">
                                   <h4 className=" truncate text-text">
                                      {item.track.name}
                                   </h4>
                                   <p className="truncate">
                                      {item.track.artists[0].name}
                                   </p>
                                </div>
                             )}
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
