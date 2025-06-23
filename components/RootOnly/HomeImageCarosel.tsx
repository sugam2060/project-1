import { getCaroselImages } from '@/actions/productActions/ManageHomeCarosel';
import CarouselClient from './CarouselClient';

const HomeImageCarosel = async () => {
  const images = await getCaroselImages() || [];
  
  return <CarouselClient images={images} />;
};

export default HomeImageCarosel;
