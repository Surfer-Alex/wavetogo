export const fetchFavorites=async(uid:string,setFavorites:(favorites: string[]) => void)=>{
    try{
      const data = await fetch(`/api/firebase/favorites/?uid=${uid}`)
      const parsedData = await data.json()
      setFavorites(parsedData.favorites)
      
    }catch(err){
      console.error('Error fetching favorites:', err);
    }
  }