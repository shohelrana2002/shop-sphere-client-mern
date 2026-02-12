const CategoryCard = ({ name, image, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className="relative w-32 h-32 md:w-44 md:h-44 shrink-0 rounded-2xl overflow-hidden border border-orange-200 bg-white shadow-md hover:shadow-xl  transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover  group-hover:scale-110 transition-transform duration-500"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

      {/* Category Text */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl  bg-white/90 backdrop-blur-md text-sm font-semibold text-gray-800   shadow-sm">
        {name?.slice(0, 8)}
      </div>
    </div>
  );
};

export default CategoryCard;
