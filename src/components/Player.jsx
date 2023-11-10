import { useState, useEffect, useRef } from "react";
import { Pause, Play } from "lucide-react";

const Player = () => {
  const [videoSrc, setVideoSrc] = useState("");
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const width = 960;
  const height = 540;

  const drawImage = () => {
    if (videoRef.current && canvasRef.current && !videoRef.current.paused) {
      const context = canvasRef.current.getContext("2d", { alpha: false });
      context.drawImage(videoRef.current, 0, 0, width, height);
      requestAnimationFrame(drawImage);
    }
  };

  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      const handlePlay = () => {
        if (videoRef.current.readyState === 4) {
          drawImage();
        }
      };

      const handleCanPlay = () => {
        if (!isPlaying) {
          drawImage();
        }
      };

      const handleLoadedMetadata = () => {
        setDuration(videoRef.current.duration);
        setHasAudio(videoRef.current.hasAudio); // Check if the video has audio
      };

      videoRef.current.addEventListener("play", handlePlay);
      videoRef.current.addEventListener("canplay", handleCanPlay);
      videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        videoRef.current.removeEventListener("play", handlePlay);
        videoRef.current.removeEventListener("canplay", handleCanPlay);
        videoRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      };
    }
  }, [isPlaying]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoSrc(URL.createObjectURL(file));
      videoRef.current.load();
    }
  };

  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPlaying(!videoRef.current.paused);
    }
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center  h-[85vh] gap-8 mx-4  ">
      <div className="flex items-center justify-center ">
        {/* <input type="file" onChange={() => {}} accept="video/*" /> */}
        <input
          className="relative m-0 block w-full min-w-0 flex-auto rounded-lg border border-solid border-neutral-200 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-300 transition duration-300 ease-in-out file:-mx-3 file:py-2 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-lime-400 file:px-3  file:text-black file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-lime-500 focus:border-primary focus:shadow-te-primary focus:outline-none "
          type="file"
          id="formFile"
          onChange={handleFileSelect}
          accept="video/*"
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-2 md:flex-row ">
        <div className="md:flex-[0.8]  flex justify-between items-center flex-col">
          <div className="relative flex items-center justify-center w-full">
            <video
              ref={videoRef}
              className="video"
              style={{ display: "none" }}
              onLoadedMetadata={handleMetadataLoaded}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {videoSrc && (
              <div className="">
                <canvas
                  ref={canvasRef}
                  className="w-[100%] h-auto border border-white rounded-xl"
                  width={width}
                  height={height}
                />
              </div>
            )}
            <div className="absolute -translate-y-1/2 top-1/2">
              {videoSrc ? (
                <button
                  className="play-pause-button"
                  onClick={togglePlayPause}
                  disabled={!hasAudio} // Disable button if the video has no audio
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 p-2 text-white border rounded-full md:w-12 md:h-12 md:p-4" />
                  ) : (
                    <Play className="w-8 h-8 p-2 text-white border rounded-full md:w-12 md:h-12 md:p-4" />
                  )}
                </button>
              ) : null}
            </div>
          </div>
        </div>
        {videoSrc ? (
          <div className="md:flex-[0.2] border h-full  lg:mr-8 mt-2 md:mt-0 flex w-full  flex-col items-start p-4 justify-start gap-2 rounded-xl">
            <h1 className="text-xl font-medium text-white">Metadata</h1>
            {/* <hr className="h-[2px] bg-[#3d3f34] border-0 "></hr> */}

            <div className="text-slate-300 ">
              Duration: {formatTime(duration)}
            </div>
          </div>
        ) : null}
      </div>
      {/* <div className="p-4 border">
        <div id="waveform" />
      </div> */}
    </div>
  );
};

export default Player;
