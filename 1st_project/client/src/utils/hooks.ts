import { useState, useRef } from "react";
import { Config } from "./types";

export const useLocalStorage = <T>(key: string, initialVale: T) => {
  const storedData = localStorage.getItem(key);
  const [value, setValue] = useState<T>(
    storedData ? (JSON.parse(storedData) as T) : initialVale
  );

  const update = (data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    setValue(data);
  };

  return { value, update };
};

const constraints: MediaStreamConstraints = {
  audio: true,
  video: {
    width: 1024, //1280,
    height: 576, //720,
  },
};

export const useMediaStream = () => {
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [config, setConfig] = useState<Config>({
    video: false,
    audio: false,
  });
  const ref = useRef<HTMLVideoElement>(null);

  /**
   * get media stream and set to ref
   */
  const getStream = async (): Promise<MediaStream> => {
    console.log("getStream()");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      console.log({ mediaStream });
      setStream(mediaStream);
      // display audio and video
      setConfig({ video: true, audio: true });
      if (ref.current) {
        // display video
        ref.current.srcObject = mediaStream;
      }
      return mediaStream;
    } catch (e) {
      throw e;
    }
  };

  const switchAudio = async (enabled: boolean) => {
    // if mediaStream has not got fetched, then get it
    if (enabled && !stream) {
      try {
        await getStream();
      } catch (e) {
        throw e;
      }
    }
    stream?.getAudioTracks().forEach((track) => {
      // enable/disable media
      track.enabled = enabled;
      // also update config
      setConfig({ ...config, audio: enabled });
    });
  };

  const switchVideo = async (enabled: boolean) => {
    // if mediaStream has not got fetched, then get it
    if (enabled && !stream) {
      try {
        await getStream();
      } catch (e) {
        throw e;
      }
    }
    stream?.getVideoTracks().forEach((track) => {
      // enable/disable media
      track.enabled = enabled;
      // also update config
      setConfig({ ...config, video: enabled });
    });
  };

  return { stream, ref, config, getStream, switchAudio, switchVideo };
};
