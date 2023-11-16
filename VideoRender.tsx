import React, {useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Video, {VideoProperties} from 'react-native-video';

const VideoRender: React.FC<VideoProperties> = () => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const [shouldRestart, setShouldRestart] = useState(false);
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const [pausedSeekTime, setPausedSeekTime] = useState<number | null>(null);

  const background = require('./background.mp4');

  const onBuffer = (isBuffering: boolean) => {
    if (videoRef.current) {
      console.log('Video is buffering:', isBuffering);
    }
  };

  const onError = (error: any) => {
    console.error('Video loading error:', error);
  };

  const onEnd = () => {
    setIsPlaying(false);
    setShowEndMessage(true);
    setSeekTime(0);
    setShouldRestart(true);
    setTimeout(() => {
      setShowEndMessage(false);
      setShouldRestart(false);
    }, 3000);
  };

  const onPlaybackResume = () => {
    if (videoRef.current && pausedSeekTime !== null) {
      videoRef.current.seek(pausedSeekTime);
      setPausedSeekTime(null);
    }
  };

  const onProgress = (progress: any) => {
    if (videoRef.current && isPlaying) {
      setSeekTime(progress.currentTime);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(prevIsPlaying => {
      const currentVideoRef = videoRef.current;
      if (currentVideoRef) {
        if (!prevIsPlaying) {
          setShowEndMessage(false);
        }
        if (shouldRestart) {
          currentVideoRef.seek(0);
        }
      }
      return !prevIsPlaying;
    });
  };

  const onLoad = (data: any) => {
    if (data && data.duration) {
      setTotalDuration(data.duration);
      setSeekTime(0);
    }
  };

  const renderControlBar = () => (
    <View style={styles.controlBar}>
      <TouchableOpacity style={styles.controlButton} onPress={togglePlayPause}>
        <Text style={styles.text}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
      <Text style={styles.text}>
        {formatTime(seekTime)} /
        {totalDuration ? formatTime(totalDuration) : '00:00'}
      </Text>
    </View>
  );

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <View style={styles.container}>
      <Video
        source={background}
        ref={videoRef}
        onBuffer={onBuffer}
        onError={onError}
        onEnd={onEnd}
        onLoad={onLoad}
        onProgress={onProgress}
        onPlaybackResume={onPlaybackResume}
        style={styles.backgroundVideo}
        paused={!isPlaying}
        resizeMode={isFullScreen ? 'cover' : 'contain'}
        currentTime={seekTime}
      />
      {renderControlBar()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    width: '95%',
    height: 200,
    alignSelf: 'center',
    marginTop: 50,
    backgroundColor: 'black',
  },
  controlBar: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  controlButton: {
    padding: 2,
  },
  text: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default VideoRender;
