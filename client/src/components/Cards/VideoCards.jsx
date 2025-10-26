import React from "react";

// helper to format duration like "2:35"
const formatDuration = (seconds) => {
    if (!seconds) return "00:00";

    // if stored like "00:15" or "1:23"
    if (typeof seconds === "string" && seconds.includes(":")) {
        const parts = seconds.split(":").map(Number);
        if (parts.length === 2) {
            const [mins, secs] = parts;
            return `${mins}:${secs.toString().padStart(2, "0")}`;
        }
    }

    // if stored like "15" (string) or 15 (number)
    const secondsNum = parseInt(seconds, 10);
    if (isNaN(secondsNum)) return "00:00";

    const mins = Math.floor(secondsNum / 60);
    const secs = Math.floor(secondsNum % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// helper to format date like "2 days ago"
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };
    for (const [key, value] of Object.entries(intervals)) {
        const count = Math.floor(seconds / value);
        if (count >= 1) return `${count} ${key}${count > 1 ? "s" : ""} ago`;
    }
    return "just now";
};

function VideoCard({ video, onVideoClick }) {
    return (
        <div
            className="flex flex-col w-full md:w-60 lg:w-64 cursor-pointer"
            onClick={() => onVideoClick(video._id || video.id)}
        >
            <div className="relative">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="rounded-xl w-full h-36 md:h-40 lg:h-44 object-cover"
                />
                {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                        {formatDuration(video.duration)}
                    </span>
                )}
            </div>

            <div className="flex mt-2 gap-3">
                <img
                    src={video.publisher?.avatar || "/images/default-avatar.jpg"}
                    alt={video.publisher?.fullName || "Uploader"}
                    className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">
                        {video.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {video.publisher?.fullName || "Unknown Channel"}
                    </p>
                    <p className="text-xs text-gray-400">
                        {video.views || 0} views • {timeAgo(video.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
