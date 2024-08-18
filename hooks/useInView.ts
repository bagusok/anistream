import { useRef, useState, useEffect } from "react";
import { Dimensions, ScrollView } from "react-native";

interface UseInViewProps {
  ref: React.RefObject<any>;
  offset?: number;
}

const useInView = ({ ref, offset = 0 }: UseInViewProps) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const { height: windowHeight } = Dimensions.get("window");

    const handleScroll = () => {
      if (ref.current) {
        const { y: offsetY } = ref.current.getLayout();
        const isVisible =
          offsetY + ref.current.props.height >= 0 &&
          offsetY <= windowHeight + offset;
        setIsInView(isVisible);
      }
    };

    const scrollView = ref.current?.parent; // Asumsikan ref.current adalah child dari ScrollView
    if (scrollView && typeof scrollView.scrollTo === "function") {
      scrollView.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollView && typeof scrollView.scrollTo === "function") {
        scrollView.removeEventListener("scroll", handleScroll);
      }
    };
  }, [ref, offset]);

  return isInView;
};

export default useInView;
