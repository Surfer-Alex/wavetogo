import { MutableRefObject, useEffect, useRef, useState } from 'react';

const useProgressBar = (): [
  MutableRefObject<HTMLDivElement | null>,
  number,
] => {
  const [completion, setCompletion] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScrollCompletion = () => {
      if (ref.current) {
        const currentProgress = ref.current.scrollTop;
        const scrollHeight =
          ref.current.scrollHeight - ref.current.clientHeight;
        if (scrollHeight) {
          setCompletion(
            Number((currentProgress / scrollHeight).toFixed(2)) * 100
          );
        }
      }
    };

    if (ref.current) {
      ref.current.addEventListener('scroll', updateScrollCompletion);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('scroll', updateScrollCompletion);
      }
    };
  }, []);

  return [ref, completion];
};
export default useProgressBar;
