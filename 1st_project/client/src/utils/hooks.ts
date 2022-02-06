import { useState, useRef } from "react";

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
  const ref = useRef<HTMLVideoElement>(null);

  /**
   * get media stream and set to ref
   */
  const getStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);
      if (ref.current) {
        // display video
        ref.current.srcObject = mediaStream;
      }
    } catch (e) {
      throw e;
    }
  };

  const switchAudio = async (enabled: boolean) => {
    if (enabled && !stream) {
      try {
        await getStream();
      } catch (e) {
        throw e;
      }
    }
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  };

  const switchVideo = async (enabled: boolean) => {
    if (enabled && !stream) {
      try {
        await getStream();
      } catch (e) {
        throw e;
      }
    }
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
  };

  return { stream, ref, getStream, switchAudio, switchVideo };
};
