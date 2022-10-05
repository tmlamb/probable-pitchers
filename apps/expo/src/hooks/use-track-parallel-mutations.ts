import { useRef } from "react";

export const useTrackParallelMutations = () => {
  const mutationNumber = useRef(0);

  return {
    startOne: () => {
      mutationNumber.current += 1;
    },
    endOne: () => {
      if (mutationNumber.current > 0) {
        mutationNumber.current -= 1;
      }
    },
    allEnded: () => mutationNumber.current === 0,
  };
};
