import { useEffect, useRef, useState } from "react";

import {
    MediaPlayer,
    MediaProvider,
    Poster,
    type MediaPlayerInstance,
} from "@vidstack/react";
import {
    DefaultAudioLayout,
    defaultLayoutIcons,
    DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { videoInfo } from "ytdl-core";
import style from "./style.module.css";
import classNames from "classnames";
export interface Props {
    video?: videoInfo | null;
}
export function Player({ video }: Props) {
    const [src, setSrc] = useState("");
    useEffect(() => {
        if (video) setSrc(`youtube/${video.videoDetails.videoId}`);
    }, [video]);
    return (
        <>
            <MediaPlayer
                className={classNames(style.player)}
                src={src}
                crossorigin
                playsinline
                load="eager"
                aspectRatio="16/9"
                title={""}
                
            >
                <MediaProvider>
                    {video && (
                        <Poster
                            className="vds-poster"
                            src={video.videoDetails.thumbnails.at(-1)?.url}
                            alt={video.videoDetails.title}
                        />
                    )}
                </MediaProvider>

                {/* Layouts */}
                <DefaultAudioLayout icons={defaultLayoutIcons} />
                <DefaultVideoLayout icons={defaultLayoutIcons} />
            </MediaPlayer>
        </>
    );
}
