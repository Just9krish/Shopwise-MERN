import { useState, MouseEvent, FormEvent, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import categoriesData from "../../constant/categories.json";
import { formattedPrice } from "../../helper/formatPrice";
import { useAppDispatch, useAppSelector } from "../../hooks";

export default function ProductFilter() {
  const { filterText, category, price, maxPrice, minPrice } = useAppSelector(
    (state) => state.filteredProducts.filters
  );
  const { filters } = useAppSelector((state) => state.filteredProducts);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(category);
  const dispatch = useAppDispatch();

  function handleClick(e: MouseEvent<HTMLButtonElement>, category: string) {
    setActiveCategory(category);
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    dispatch({ type: "updateFilterText", payload: { name, value } });
  }

  function sorting(e: FormEvent<HTMLSelectElement>) {
    dispatch({ type: "getSortValue", payload: e.currentTarget.value });
  }

  function clearFilters(e: MouseEvent<HTMLButtonElement>) {
    dispatch({ type: "clearFilters" });
  }

  useEffect(() => {
    setActiveCategory(category);
  }, [filters]);

  return (
    <div className="space-y-6 p-4 lg:space-y-8 border bg-white shadow-md mb-10 lg:m-0">
      <div className="flex rounded border-2 items-center">
        <div className="flex items-center justify-center px-2.5 border-r">
          <span className="h-6 w-6 text-orange-500">
            <BsSearch />
          </span>
        </div>
        <input
          type="text"
          name="filterText"
          onChange={(e) =>
            dispatch({
              type: "updateFilterText",
              payload: { name: e.target.name, value: e.target.value },
            })
          }
          value={filterText}
          className="px-3 py-1 w-full"
          placeholder="Search...."
        />
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden block bg-orange-500 font-semibold text-white px-4 py-2 rounded"
      >
        More Filters
      </button>

      <div
        className={`space-y-6 lg:space-y-8 ${
          isOpen ? "block" : "hidden"
        } lg:block`}
      >
        <div>
          <form>
            <label className="hidden lg:block mb-3 font-light" htmlFor="sort">
              Sort By
            </label>
            <select
              name="sort"
              id="sort"
              onChange={sorting}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5"
            >
              <option value="relevance">Relevance</option>
              <option value="ltoh">Lowest to Highest (price)</option>
              <option value="htol">Highest to Lowest (price)</option>
            </select>
          </form>
        </div>

        <div className="flex lg:flex-col">
          <label className="hidden lg:block mb-3 font-light">Categeries</label>
          <button
            value="all"
            name="category"
            onClick={(e) => handleClick(e, "all")}
            className={`lg:mb-2 text-left p-1.5 lg:pl-4 text-sm py-1 font-medium border-b  ${
              activeCategory == "all"
                ? "border-orange-500 text-orange-500"
                : "text-gray-800 border-transparent"
            } transition-all`}
          >
            All
          </button>
          {categoriesData.map((category) => (
            <button
              key={category.id}
              value={category.title}
              name="category"
              className={`lg:mb-2 text-left p-1.5 lg:pl-4 text-sm py-1 font-medium border-b  ${
                activeCategory === category.title
                  ? "border-orange-500 text-orange-500"
                  : "text-gray-800 border-transparent"
              } transition-all`}
              onClick={(e) => handleClick(e, category.title)}
            >
              {category.title}
            </button>
          ))}
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <p className="mb-2 font-medium text-gray-800">
            {formattedPrice(price)}
          </p>
          <input
            type="range"
            id="price"
            name="price"
            min={minPrice}
            max={maxPrice}
            value={price}
            onChange={(e) =>
              dispatch({
                type: "updateFilterText",
                payload: { name: e.target.name, value: e.target.value },
              })
            }
          />
        </div>

        <div>
          <button
            onClick={clearFilters}
            className="font-medium bg-red-500 text-white px-4 py-1.5 rounded-sm"
          >
            Clear Filter
          </button>
        </div>
      </div>
    </div>
  );
}
