import { useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import BreadCrumb from '@/components/BreadCrumbs';
import CategoryMenu from '@/components/products/CategoryMenu';
import { PaginationDemo } from '@/components/util/Pagination';
import { BookCard } from '@/components/products/BookCard';
import { productContentParser } from '@/helper/tool';
import { Loader } from '@/components/Loader';
import { Link, useSearchParams } from 'react-router-dom';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const rawPage = searchParams.get('page');
  const page = rawPage ? Number(rawPage) : 1;

  const flexProducts = useProductStore((state) => state.flexProducts);
  const isLoading = useProductStore((state) => state.isLoading);
  const pagination = useProductStore((state) => state.pagination);

  useEffect(() => {
    useProductStore.getState().fetchByCategory({
      category,
      page,
    });
  }, [category, page]);

  const handleCategoryChange = (newCategory: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (newCategory) {
      newParams.set('category', newCategory);
    } else {
      newParams.delete('category');
    }

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number | string) => {
    const pageNum = Number(newPage);
    if (Number.isNaN(pageNum)) return;

    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(pageNum));

    if (category) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }

    setSearchParams(newParams);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <BreadCrumb />
            <div className="flex flex-col lg:flex-row gap-8">
              <CategoryMenu
                selected={category}
                handleCategoryChange={handleCategoryChange}
              />
              <div className="flex-1 flex flex-col min-h-[70vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {flexProducts.map((book) => (
                    <Link
                      key={book.id}
                      to={`/shop/${book.id}`}
                      className="block"
                    >
                      <BookCard
                        title={book.title}
                        author={productContentParser(book).author || 'Unknown'}
                        price={book.price}
                        originalPrice={book.origin_price}
                        imageQuery={book.imageUrl}
                        rating={book.rating}
                      />
                    </Link>
                  ))}
                </div>

                {pagination && (
                  <div className="mt-auto pt-10">
                    <PaginationDemo
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Shop;
