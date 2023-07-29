import { Skeleton } from "@mui/material";
type CardSkeletonProps = {
  cards: number | undefined;
};
const CardSkeleton = ({ cards }: CardSkeletonProps) => {
  return Array(cards)
    .fill(0)
    .map((_, idx) => (
      <div
        key={idx}
        className="h-[140px] rounded-2xl  bg-slate-100 lg:h-[280px] lg:w-full xl:w-negativeGap"
      >
        <div className="flex h-full w-[400px] lg:w-full lg:flex-col">
          <Skeleton
            className="h-[140px] w-2/5 rounded-l-xl lg:h-[162px] lg:w-full lg:rounded-t-2xl"
            variant="rounded"
            // height={162}
          />
          <div className="flex-grow">
            <div className="ml-6 mt-3 flex items-center lg:mt-6  lg:w-full ">
              <Skeleton
                className="w-1/2 font-bold  text-gray-600"
                variant="text"
                sx={{ fontSize: "1rem" }}
              />
              <Skeleton
                className=" ml-4 w-5 font-bold text-gray-600 "
                variant="circular"
              />{" "}
            </div>
            <Skeleton
              className="ml-6 mt-1 w-1/2"
              variant="text"
              sx={{ fontSize: "2rem" }}
            />
            <div className="ml-6 mt-1 flex">
              <Skeleton
                className="w-1/3 font-bold text-gray-600"
                variant="text"
                sx={{ fontSize: "1rem" }}
              />
              <Skeleton
                className="ml-auto mr-4 w-1/3 font-bold text-gray-600"
                variant="text"
                sx={{ fontSize: "1rem" }}
              />
            </div>
          </div>
        </div>
      </div>
    ));
};

export default CardSkeleton;
