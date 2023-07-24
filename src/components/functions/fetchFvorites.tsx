// const fetchFavorites = async (uid:string,setSpots:(spots: string[]) => void) => {
//   try {
//     const data = await fetch(`/api/firebase/favorites/?uid=${uid}`);
//     const parsedData = await data.json();

//     const spotInfo = spotData.data.spots.filter((spot) =>
//       parsedData.favorites.includes(spot._id)
//     );
//     setSpots(spotInfo);
//   } catch (err) {
//     console.error('Error fetching favorites:', err);
//   }
// };
