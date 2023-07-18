import { Skeleton } from '@mui/material';
type CardSkeletonProps = {
  cards: number;
};
const CardSkeleton = ({ cards }: CardSkeletonProps) => {
  return Array(cards)
    .fill(0)
    .map((_, idx) => (
      <div
        key={idx}
        className="bg-slate-100 rounded-2xl h-[280px] w-negativeGap"
      >
        <Skeleton
          className="w-full h-[162px] rounded-t-2xl"
          variant="rounded"
        />
        <div className="ml-6 mt-1 flex  items-center">
          <Skeleton
            className="font-bold text-gray-600  w-1/2"
            variant="text"
            sx={{ fontSize: '1rem' }}
          />
          <Skeleton
            className=" ml-4 font-bold text-gray-600 w-5 "
            variant="circular"
          />{' '}
        </div>
        <Skeleton
          className="font-bold text-gray-600 ml-6 mt-1 w-1/2"
          variant="text"
          sx={{ fontSize: '2rem' }}
        />
        <div className="ml-6 mt-1 flex">
          <Skeleton
            className="font-bold text-gray-600 w-1/3"
            variant="text"
            sx={{ fontSize: '1rem' }}
          />
          <Skeleton
            className="ml-auto mr-4 font-bold text-gray-600 w-1/3"
            variant="text"
            sx={{ fontSize: '1rem' }}
          />
        </div>
      </div>
    ));
};

export default CardSkeleton;
