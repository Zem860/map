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
    const next = new URLSearchParams(searchParams);

    if (newCategory) {
      next.set('category', newCategory);
    } else {
      next.delete('category');
    }

    next.set('page', '1');
    setSearchParams(next);
  };

  const handlePageChange = (newPage: number | string) => {
    const pageNum = Number(newPage);
    if (Number.isNaN(pageNum)) return;

    const next = new URLSearchParams(searchParams);

    if (category) {
      next.set('category', category);
    } else {
      next.delete('category');
    }

    next.set('page', String(pageNum));
    setSearchParams(next);
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {flexProducts.map((book) => (
                  <Link key={book.id} to={`/shop/${book.id}`} className="block">
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
            </div>

            {pagination && (
              <PaginationDemo
                pagination={{
                  ...pagination,
                  current_page: Number(pagination.current_page),
                  total_pages: Number(pagination.total_pages),
                }}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;
