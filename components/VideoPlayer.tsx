import { ResizeMode, Video } from "expo-av";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import {
  ActivityIndicator,
  BackHandler,
  LayoutChangeEvent,
  Pressable,
  StatusBar,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { CustomText } from "./ui";
import { runOnJS } from "react-native-reanimated";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useColors } from "@/hooks/useColors";
import * as ScreenOrientation from "expo-screen-orientation";
import useScreenOrientation from "@/hooks/useOrientation";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";

const VideoPlayer = memo(
  ({ src, title, data }: { src: string; title?: string; data: [] }) => {
    const colors = useColors();

    const videoRef = useRef<Video>(null);
    const [showVideoControls, setShowVideoControls] = useState(true);
    const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["50%", "70%", "90%"], []);

    const { orientation } = useScreenOrientation();

    const [videoSrc, setVideoSrc] = useState<string>(src);
    const [videoResolution, setVideoResolution] = useState<string>("720p");

    const [isPlayed, setIsPlayed] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [videoStatus, setVideoStatus] = useState<VideoStatus>(
      VideoStatus.LOADING
    );

    const [videoHeight, setVideoHeight] = useState<any>("auto");

    const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
    const [overlaySize, setOverlaySize] = useState({ width: 0, height: 0 });

    const dimensions = useWindowDimensions();

    useEffect(() => {
      const videoHeight = (videoSize.width / 16) * 9;
      const videoWidth = (videoSize.height / 9) * 16;

      const layarKosongVertical = videoSize.height - videoHeight;
      const layarKosongHorizontal = videoSize.width - videoWidth;

      const top = layarKosongVertical < 0 ? 5 : layarKosongVertical / 2;
      const right = layarKosongHorizontal < 0 ? 5 : layarKosongHorizontal / 2;
      console.log("aa", videoHeight, videoSize.height, layarKosongVertical);

      setOverlaySize({
        width: right,
        height: top,
      });
      // console.log("videoSize", overlaySize);
    }, [videoSize]);

    useEffect(() => {
      if (
        orientation == ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        orientation == ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        StatusBar.setHidden(true);
        setIsFullscreen(true);
        setVideoHeight(dimensions.height);
      } else {
        StatusBar.setHidden(false);
        if (isFullscreen) {
          setVideoHeight(dimensions.height);
        } else {
          setVideoHeight("auto");
        }
      }
    }, [orientation, isFullscreen]);

    useEffect(() => {
      const backAction = () => {
        if (isFullscreen) {
          runOnJS(toggleFullscreen)();
          return false;
        }

        return false;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      const allSources = data.flatMap((server: any) => server.source);
      allSources.sort((a, b) => {
        const qualityOrder = ["1080p", "720p", "480p", "360p", "4K"];
        return (
          qualityOrder.indexOf(a.quality) - qualityOrder.indexOf(b.quality)
        );
      });

      setVideoSrc(allSources[0].url);
      setVideoResolution(allSources[0].quality);

      return () => backHandler.remove();
    }, [title]);

    useEffect(() => {
      const intervalId = setInterval(async () => {
        if (videoRef.current) {
          const status = await videoRef.current.getStatusAsync();
          if (status.isLoaded) {
            setProgress(status.positionMillis);
            setDuration(status.durationMillis || 0);
          }
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }, []);

    const changeResolution = (url: string, quality: string) => {
      setIsPlayed(false);
      setVideoSrc(url);
      setVideoResolution(quality);
      bottomSheetRef.current?.dismiss();
      setIsPlayed(true);
    };

    const toggleFullscreen = async () => {
      if (!isFullscreen) {
        // await ScreenOrientation.lockAsync(
        //   ScreenOrientation.OrientationLock.LANDSCAPE
        // );
        setIsFullscreen(true);
      } else {
        // await ScreenOrientation.lockAsync(
        //   ScreenOrientation.OrientationLock.PORTRAIT
        // );

        if (
          orientation == ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
          orientation == ScreenOrientation.Orientation.LANDSCAPE_RIGHT
        ) {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
          await ScreenOrientation.unlockAsync();
        }

        setIsFullscreen(false);
      }
    };

    const showControlsWithTimeout = () => {
      setShowVideoControls(true);
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      hideControlsTimeout.current = setTimeout(() => {
        runOnJS(setShowVideoControls)((prev) => false);
      }, 3000); // Hide controls after 3 seconds
    };

    const resetTimeout = () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      hideControlsTimeout.current = setTimeout(() => {
        runOnJS(setShowVideoControls)((prev) => false);
      }, 3000); // Hide controls after 3 seconds
    };

    const hideControls = () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      runOnJS(setShowVideoControls)((prev) => false);
    };

    const pauseVideo = () => {
      videoRef.current?.pauseAsync();
      setIsPlayed(false);
    };

    const playVideo = () => {
      videoRef.current?.playAsync();
      setIsPlayed(true);
    };

    const playPauseVideo = () => {
      if (isPlayed) {
        runOnJS(pauseVideo)();
      } else {
        runOnJS(playVideo)();
      }
    };

    const skipBackward = async () => {
      if (videoRef.current) {
        const status = await videoRef.current.getStatusAsync();
        if (status.isLoaded) {
          const newPosition = Math.max(status.positionMillis - 10000, 0); // Skip back 10 seconds
          await videoRef.current.setPositionAsync(newPosition);
        }
      }
    };

    const skipForward = async () => {
      if (videoRef.current) {
        const status = await videoRef.current.getStatusAsync();
        if (status.isLoaded) {
          const newPosition = Math.min(
            status.positionMillis + 10000,
            status.durationMillis ?? 0
          ); // Skip forward 10 seconds
          await videoRef.current.setPositionAsync(newPosition);
        }
      }
    };

    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onStart((event) => {
        const touchX = event.absoluteX;
        const mid = dimensions.width / 2;
        if (touchX < mid) {
          runOnJS(skipBackward)();
        } else {
          runOnJS(skipForward)();
        }
      });

    const singleTap = Gesture.Tap().onStart((event) => {
      console.log("Single Tap");
      runOnJS(showControlsWithTimeout)();
    });

    const overlayTap = Gesture.Tap().onStart(() => {
      console.log("Overlay Tap");
      // runOnJS(resetTimeout)();
      runOnJS(hideControls)();
    });

    const parseTime = (time: number) => {
      const minutes = Math.floor(time / 60000);
      const seconds = ((time % 60000) / 1000).toFixed(0);
      return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
    };

    const openBottomSheet = () => {
      console.log("open bottom sheet");
      bottomSheetRef.current?.present();
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="close" // Menutup BottomSheet saat klik di luar area
          disappearsOnIndex={-1}
        />
      ),
      []
    );

    const onLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;

      setVideoSize({
        width,
        height,
      });
    };

    return (
      <>
        <View
          style={{
            width: "100%",
            position: "relative",
            borderBottomWidth: 1,
            borderBottomColor: colors.secondary,
          }}
        >
          <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap)}>
            <Video
              onLayout={onLayout}
              ref={videoRef}
              style={{
                width: "100%",
                ...(!isFullscreen && { aspectRatio: 16 / 9 }),
                height: videoHeight,
                backgroundColor: colors.black,
              }}
              source={{
                uri: videoSrc,
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
                },
              }}
              resizeMode={ResizeMode.CONTAIN}
              onPlaybackStatusUpdate={(status) => {
                if (status.isLoaded) {
                  const buffering =
                    (status.playableDurationMillis ?? 0) <=
                    status.positionMillis;

                  if (buffering) {
                    setVideoStatus(VideoStatus.BUFFERING);
                  } else {
                    setVideoStatus(VideoStatus.READY);
                  }
                } else if (status.error) {
                  setVideoStatus(VideoStatus.ERROR);
                  console.log("Error", status.error);
                }
              }}
              onLoadStart={() => setVideoStatus(VideoStatus.LOADING)}
              onReadyForDisplay={() => {
                setVideoStatus(VideoStatus.READY);
                runOnJS(playVideo)();
              }}
            />
          </GestureDetector>
          {showVideoControls && videoStatus == VideoStatus.READY && (
            <GestureDetector gesture={overlayTap}>
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  position: "absolute",
                  justifyContent: "space-between",
                  paddingTop: 10,
                  paddingHorizontal: 10,
                  zIndex: 10,
                  paddingBottom:
                    orientation ==
                      ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
                    orientation == ScreenOrientation.Orientation.LANDSCAPE_RIGHT
                      ? 20
                      : 0,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Feather name="chevron-down" size={16} color="white" />

                    <CustomText color="white" size={14}>
                      {title}
                    </CustomText>
                  </View>
                </View>

                {/* TENGAH */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "space-around",
                  }}
                >
                  <GestureDetector gesture={Gesture.Tap().onEnd(() => {})}>
                    <Feather name="skip-back" size={24} color="white" />
                  </GestureDetector>
                  <GestureDetector
                    gesture={Gesture.Tap().onEnd(() =>
                      runOnJS(playPauseVideo)()
                    )}
                  >
                    {isPlayed ? (
                      <Feather name="pause" size={24} color="white" />
                    ) : (
                      <Feather name="play" size={24} color="white" />
                    )}
                  </GestureDetector>
                  <GestureDetector gesture={Gesture.Tap().onEnd(() => {})}>
                    <Feather name="skip-forward" size={24} color="white" />
                  </GestureDetector>
                </View>

                {/* Bawah */}
                <View style={{}}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 2,
                      }}
                    >
                      <CustomText color="white" size={12}>
                        {parseTime(progress)}
                      </CustomText>
                      <CustomText
                        color="white"
                        size={12}
                        style={{ opacity: 0.5 }}
                      >
                        /
                      </CustomText>
                      <CustomText
                        color="white"
                        size={12}
                        style={{ opacity: 0.5 }}
                      >
                        {parseTime(duration)}
                      </CustomText>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <GestureDetector
                        gesture={Gesture.Tap().onEnd(() =>
                          runOnJS(openBottomSheet)()
                        )}
                      >
                        <CustomText color="white">{videoResolution}</CustomText>
                      </GestureDetector>
                      <Pressable
                        onPress={() => (isPlayed ? pauseVideo() : playVideo())}
                      >
                        <CustomText color="white">1.5x</CustomText>
                      </Pressable>
                      <GestureDetector
                        gesture={Gesture.Tap().onEnd(() =>
                          runOnJS(toggleFullscreen)()
                        )}
                      >
                        <MaterialIcons
                          name={isFullscreen ? "fullscreen-exit" : "fullscreen"}
                          size={24}
                          color="white"
                        />
                      </GestureDetector>
                    </View>
                  </View>

                  {/* Video Slider Time Control */}
                  <Slider
                    style={{ width: "100%" }}
                    minimumValue={0}
                    maximumValue={duration}
                    value={progress}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.gray[200]}
                    thumbTintColor={colors.primary}
                    onSlidingComplete={(value) => {
                      videoRef.current?.setPositionAsync(value);
                    }}
                    onValueChange={(value) => {
                      setProgress(value);
                    }}
                  />
                </View>
              </View>
            </GestureDetector>
          )}

          {videoStatus == VideoStatus.LOADING && (
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
                paddingTop: 10,
                paddingHorizontal: 10,
                paddingBottom:
                  orientation == ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
                  orientation == ScreenOrientation.Orientation.LANDSCAPE_RIGHT
                    ? 20
                    : 0,
              }}
            >
              <CustomText color="white">Loading...</CustomText>
            </View>
          )}

          {videoStatus == VideoStatus.BUFFERING && (
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
                paddingTop: 10,
                paddingHorizontal: 10,
                paddingBottom:
                  orientation == ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
                  orientation == ScreenOrientation.Orientation.LANDSCAPE_RIGHT
                    ? 20
                    : 0,
              }}
            >
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}

          {videoStatus == VideoStatus.ERROR && (
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.8)",
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
                paddingTop: 10,
                paddingHorizontal: 10,
                paddingBottom:
                  orientation == ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
                  orientation == ScreenOrientation.Orientation.LANDSCAPE_RIGHT
                    ? 20
                    : 0,
              }}
            >
              <CustomText color="white">Error</CustomText>
              <TouchableWithoutFeedback
                onPress={() => openBottomSheet()}
                style={{
                  marginTop: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 5,
                  borderRadius: 10,
                  backgroundColor: colors.muted,
                }}
              >
                <CustomText color="white">Change Resolution</CustomText>
              </TouchableWithoutFeedback>
            </View>
          )}

          {/* WM VIDEO */}
          {videoStatus != VideoStatus.ERROR && (
            <View
              style={{
                position: "absolute",
                top: overlaySize.height,
                right: overlaySize.width,
                width: "10%",
                height: 20,

                // backgroundColor: colors.primary,
                zIndex: 1,
              }}
            >
              <Image
                source={require("./../assets/images/video-watermark.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  opacity: 0.8,
                }}
                contentFit="contain"
              />
            </View>
          )}
        </View>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{
            backgroundColor: colors.background,
            borderColor: colors.muted,
            borderTopWidth: 1.5,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          handleIndicatorStyle={{ backgroundColor: colors.white }}
          backdropComponent={renderBackdrop}
        >
          <BottomSheetView
            style={{
              flex: 1,
              padding: 16,
              backgroundColor: colors.background,
            }}
          >
            <CustomText
              fontStyle="medium"
              size={20}
              style={{ textAlign: "center", marginBottom: 20 }}
            >
              Resolution
            </CustomText>

            {data?.map((item: any, index) => (
              <Fragment key={item.name}>
                <CustomText size={14} fontStyle="medium">
                  Server {index + 1}
                </CustomText>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginTop: 6,
                    flexWrap: "wrap",
                    marginBottom: 10,
                  }}
                >
                  {item?.source?.map((source: any, index: number) => (
                    <TouchableWithoutFeedback
                      onPress={() =>
                        changeResolution(source.url, source.quality)
                      }
                      key={source.id}
                      style={{
                        backgroundColor:
                          source.url === videoSrc
                            ? colors.primary
                            : colors.muted,
                        paddingHorizontal: 16,
                        paddingVertical: 5,
                        borderRadius: 10,
                      }}
                    >
                      <CustomText size={12}>{source.quality}</CustomText>
                    </TouchableWithoutFeedback>
                  ))}
                </View>
              </Fragment>
            ))}
          </BottomSheetView>
        </BottomSheetModal>
      </>
    );
  }
);

export default VideoPlayer;

enum VideoStatus {
  LOADING,
  READY,
  BUFFERING,
  ERROR,
}
